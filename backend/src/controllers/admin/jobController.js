import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * Get all pending jobs (for admin review)
 * @route GET /api/admin/jobs/pending
 * @access Private (admin only)
 */
export const getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.find({
      status: 'pending_admin_review',
    })
      .populate({
        path: 'client',
        select: 'name phone user',
        populate: {
          path: 'user',
          model: 'User',
          select: 'email',
        },
      })
      .lean(); // convert to plain JS objects for easy modification

    // Flatten email to top-level client object
    const jobsWithEmail = pendingJobs.map((job) => ({
      ...job,
      client: {
        ...job.client,
        email: job.client.user?.email || 'N/A',
      },
    }));

    res.json({ success: true, data: jobsWithEmail });
  } catch (err) {
    console.error('getPendingJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending jobs',
      error: err.message,
    });
  }
};

/**
 * Admin reviews a job, sets required pricing range & skills, notifies experts & client
 * @route PUT /api/admin/jobs/:jobId/review
 * @access Private (admin only)
 */
export const reviewJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    let { minPrice, maxPrice, skillsRequired, branch, category } = req.body;

    // Validate Job ID
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Job ID' });
    }

    // Convert skills to array if string
    if (typeof skillsRequired === 'string') {
      skillsRequired = skillsRequired
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Validate new required fields
    if (!branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required (Academic or Industrial).',
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required.',
      });
    }

    if (minPrice == null || maxPrice == null) {
      return res.status(400).json({
        success: false,
        message: 'Admin pricing min & max are required.',
      });
    }

    if (!skillsRequired?.length) {
      return res.status(400).json({
        success: false,
        message: 'Skills are required.',
      });
    }

    if (minPrice > maxPrice) {
      return res.status(400).json({
        success: false,
        message: 'Min price cannot be greater than max price.',
      });
    }

    // Find Job
    const job = await Job.findById(jobId).populate('client', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Update job fields
    job.pricingRange = { min: minPrice, max: maxPrice };
    job.skillsRequired = skillsRequired;
    job.branch = branch;
    job.category = category;
    job.status = 'approved_for_bidding';

    await job.save();

    const io = req.app.get('io');

    // Notify client
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
        to: job.client.email,
        subject: 'Your Job Has Been Approved',
        html: `
          <h2>Job Approved</h2>
          <p>Your job "<strong>${job.title}</strong>" is now approved.</p>
          <p><strong>Branch:</strong> ${branch}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Price Range:</strong> KES ${minPrice} - ${maxPrice}</p>
          <p><strong>Skills Required:</strong> ${skillsRequired.join(', ')}</p>
        `,
      });
    } catch (e) {
      console.warn(
        'Failed to notify client via email/notification:',
        e.message
      );
    }

    // Match experts based on SKILLS
    const matchedExperts = await Expert.find({
      skills: { $in: skillsRequired },
    });

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

        if (io) {
          io.to(`expert_${ex._id}`).emit('expert:new_job', {
            jobId: job._id,
            title: job.title,
            minPrice,
            maxPrice,
            branch,
            category,
          });
        }

        await sendEmail({
          to: ex.email,
          subject: 'Job Matching Your Skills',
          html: `
            <h2>New Job</h2>
            <p><strong>Title:</strong> ${job.title}</p>
            <p><strong>Branch:</strong> ${branch}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Price Range:</strong> KES ${minPrice}-${maxPrice}</p>
            <p><strong>Skills:</strong> ${skillsRequired.join(', ')}</p>
          `,
        });
      } catch (e) {
        console.warn(`Failed to notify expert ${ex._id}:`, e.message);
      }
    }

    return res.json({
      success: true,
      message: 'Job approved & notifications sent',
      job,
    });
  } catch (err) {
    console.error('reviewJob error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to review job',
      error: err.message,
    });
  }
};

/**
 * Reject job
 * @route PUT /api/admin/jobs/:jobId/reject
 * @access Private (admin only)
 */
export const rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('client', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.status = 'rejected';
    await job.save();

    // Notify client
    await Notification.create({
      userType: 'Client',
      userId: job.client._id,
      title: 'Job Rejected',
      message: `Your job "${job.title}" was rejected by admin.`,
      jobId: job._id,
      read: false,
    });

    await sendEmail({
      to: job.client.email,
      subject: 'Job Rejected by Admin',
      html: `<h2>Job Rejected</h2>
             <p>Your job "<strong>${job.title}</strong>" was rejected by the admin.</p>`,
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

/**
 * Get all active jobs
 * @route GET /api/admin/jobs/active
 * @access Private (admin only)
 */
export const getActiveJobs = async (req, res) => {
  try {
    const activeJobs = await Job.find({
      status: { $in: ['approved_for_bidding', 'assigned', 'in_progress'] },
    })
      .populate('client', 'name email')
      .populate('approvedExperts', 'name email')
      .lean();

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
