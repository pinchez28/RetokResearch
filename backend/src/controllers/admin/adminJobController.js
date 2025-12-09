import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/notification/Notification.js';
import User from '../../models/auth/User.js';
import sendEmail from '../../../utils/sendEmail.js';
import { createNotificationForUsers } from '../../../utils/notify.js';

// ---------------- 1. Get Pending Jobs ----------------
export const getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.find({ status: 'pending_admin_review' })
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email name' },
      })
      .lean({ virtuals: true });

    res.json({ success: true, data: pendingJobs });
  } catch (err) {
    console.error('getPendingJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending jobs',
      error: err.message,
    });
  }
};

// ---------------- 2. Review Job (Approve) ----------------
export const reviewJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    let { minPrice, maxPrice, skillsRequired, branch, category } = req.body;

    if (!jobId.match(/^[0-9a-fA-F]{24}$/))
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Job ID' });

    if (typeof skillsRequired === 'string') {
      skillsRequired = skillsRequired
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (
      !branch ||
      !category ||
      minPrice == null ||
      maxPrice == null ||
      !skillsRequired.length
    )
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });

    if (minPrice > maxPrice)
      return res.status(400).json({
        success: false,
        message: 'Min price cannot be greater than max price.',
      });

    const job = await Job.findById(jobId).populate({
      path: 'client',
      populate: { path: 'user', select: 'email name' },
    });
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // Update job
    job.pricingRange = { min: minPrice, max: maxPrice };
    job.skillsRequired = skillsRequired;
    job.branch = branch;
    job.category = category;
    job.status = 'approved_for_bidding';
    await job.save();

    const io = req.app.get('io');

    // ---------------- Notify Client ----------------
    try {
      await Notification.create({
        userType: 'Client',
        userId: job.client._id,
        title: 'Job Approved by Admin',
        message: `Your job "${job.title}" has been approved under ${branch} → ${category}.`,
        jobId: job._id,
        read: false,
      });

      await sendEmail({
        to: job.client.user.email,
        subject: 'Your Job Has Been Approved',
        html: `<h2>Job Approved</h2>
               <p>Title: ${job.title}</p>
               <p>Branch: ${branch}</p>
               <p>Category: ${category}</p>
               <p>Price Range: KES ${minPrice}-${maxPrice}</p>
               <p>Skills: ${skillsRequired.join(', ')}</p>`,
      });
    } catch (e) {
      console.warn('Failed to notify client:', e.message);
    }

    // ---------------- Match Experts ----------------
    const matchedExperts = await Expert.find({
      skills: { $in: skillsRequired },
    }).populate('user', 'email name'); // ensure email for sending

    job.approvedExperts = matchedExperts.map((e) => e._id);
    await job.save();

    // Notify experts
    for (const ex of matchedExperts) {
      try {
        await Notification.create({
          userType: 'Expert',
          userId: ex._id,
          title: 'New Job Available',
          message: `A new job "${job.title}" matches your skills.`,
          jobId: job._id,
          read: false,
        });

        if (io)
          io.to(`expert_${ex._id}`).emit('expert:new_job', {
            jobId: job._id,
            title: job.title,
            minPrice,
            maxPrice,
            branch,
            category,
          });

        await sendEmail({
          to: ex.user.email,
          subject: 'Job Matching Your Skills',
          html: `<p>Title: ${job.title}</p>
                 <p>Branch: ${branch}</p>
                 <p>Category: ${category}</p>
                 <p>Price Range: KES ${minPrice}-${maxPrice}</p>
                 <p>Skills: ${skillsRequired.join(', ')}</p>`,
        });
      } catch (e) {
        console.warn(`Failed to notify expert ${ex._id}:`, e.message);
      }
    }

    res.json({
      success: true,
      message: 'Job approved & notifications sent',
      job,
    });
  } catch (err) {
    console.error('reviewJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to review job',
      error: err.message,
    });
  }
};

// ---------------- 3. Reject Job ----------------
export const rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate({
      path: 'client',
      populate: { path: 'user', select: 'email name' },
    });
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = 'rejected';
    await job.save();

    await Notification.create({
      userType: 'Client',
      userId: job.client._id,
      title: 'Job Rejected',
      message: `Your job "${job.title}" was rejected by admin.`,
      jobId: job._id,
      read: false,
    });

    await sendEmail({
      to: job.client.user.email,
      subject: 'Job Rejected by Admin',
      html: `<h2>Job Rejected</h2><p>Title: ${job.title}</p>`,
    });

    res.json({
      success: true,
      message: 'Job rejected and client notified',
      job,
    });
  } catch (err) {
    console.error('rejectJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to reject job',
      error: err.message,
    });
  }
};

// ---------------- 4. Get Active Jobs ----------------
export const getActiveJobs = async (req, res) => {
  try {
    const activeJobs = await Job.find({
      status: { $in: ['approved_for_bidding', 'assigned', 'in_progress'] },
    })
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email name' },
      })
      .populate('approvedExperts', 'name email')
      .populate('assignedExpert', 'name email')
      .lean({ virtuals: true });

    res.json({ success: true, data: activeJobs });
  } catch (err) {
    console.error('getActiveJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active jobs',
      error: err.message,
    });
  }
};

// ---------------- 5. Get Job By ID ----------------
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate('client', 'name email')
      .populate('assignedExpert', 'fullName email certifications')
      .populate('applications.expert', 'fullName email');

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('getJobById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- 6. Assign Expert ----------------
export const assignExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { expertId } = req.body;

    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    if (job.status !== 'approved_for_bidding')
      return res.status(400).json({
        success: false,
        message: 'Cannot assign expert at this stage.',
      });

    job.assignedExpert = expertId;
    job.status = 'assigned';
    await job.save();

    await createNotificationForUsers({
      userIds: [expertId],
      sender: req.user._id,
      type: 'job_assigned',
      title: `You were assigned to job: ${job.title}`,
      message: `Admin assigned you to the job "${job.title}".`,
      link: `/expert/jobs/${job._id}`,
      sendEmailFlag: true,
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('assignExpert error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- 7. Update Job ----------------
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    const allowed = ['category', 'skillsRequired', 'pricingRange', 'status'];
    allowed.forEach((key) => {
      if (updates[key] !== undefined) job[key] = updates[key];
    });

    await job.save();
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('updateJob error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- 8. Delete Job ----------------
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    await job.remove();
    res
      .status(200)
      .json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
