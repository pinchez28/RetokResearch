import Job from '../../models/client/Job.js';
import User from '../../models/auth/User.js';
import { createNotificationForUsers } from '../../utils/notify.js';

// GET /api/admin/jobs/active
export const getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: { $in: ['approved_for_bidding', 'assigned', 'in_progress'] },
    })
      .populate('client', 'name email')
      .populate('assignedExpert', 'name email')
      .lean();

    return res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error('getActiveJobs error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/admin/jobs/:id/assign
export const assignExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { expertId } = req.body;

    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    // Only allow assigning if job is approved_for_bidding
    if (job.status !== 'approved_for_bidding') {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Cannot assign expert at this stage.',
        });
    }

    job.assignedExpert = expertId;
    job.status = 'assigned';
    await job.save();

    // Notify assigned expert
    await createNotificationForUsers({
      userIds: [expertId],
      sender: req.user._id,
      type: 'job_assigned',
      title: `You were assigned to job: ${job.title}`,
      message: `Admin assigned you to the job "${job.title}".`,
      link: `/expert/jobs/${job._id}`,
      sendEmailFlag: true,
    });

    return res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('assignExpert error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/admin/jobs/:id/update
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    // Admin can update category, skillsRequired, pricingRange, status
    const allowed = ['category', 'skillsRequired', 'pricingRange', 'status'];
    allowed.forEach((key) => {
      if (updates[key] !== undefined) job[key] = updates[key];
    });

    await job.save();

    // Notify client if status changed
    if (updates.status && updates.status !== job.status) {
      await createNotificationForUsers({
        userIds: [job.client],
        sender: req.user._id,
        type: 'job_status_updated',
        title: `Your job "${job.title}" status updated`,
        message: `Admin updated status to "${updates.status}".`,
        link: `/client/jobs/${job._id}`,
        sendEmailFlag: true,
      });
    }

    return res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('updateJob error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/admin/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });

    await job.remove();
    return res
      .status(200)
      .json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('deleteJob error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
