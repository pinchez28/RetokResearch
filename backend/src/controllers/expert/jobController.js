import mongoose from 'mongoose';
import Job from '../../models/client/Job.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * @desc Get all approved jobs available for experts (ignore approvedExperts for now)
 * @route GET /api/expert/jobs
 * @access Private (expert only)
 */
export const getAvailableJobs = async (req, res) => {
  try {
    // Fetch all jobs that are approved by admin
    const jobs = await Job.find({
      status: 'approved_for_bidding',
    })
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, jobs });
  } catch (err) {
    console.error('getAvailableJobs error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Expert applies for a job
 * @route POST /api/expert/jobs/:jobId/apply
 * @access Private (expert only)
 */
export const applyForJob = async (req, res) => {
  try {
    const expertId = req.user.id;
    const { jobId } = req.params;
    const { coverLetter, quote } = req.body;

    if (!coverLetter || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Cover letter and quote are required',
      });
    }

    const job = await Job.findById(jobId).populate('client', 'name email');
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (!job.applications) job.applications = [];

    job.applications.push({
      expert: expertId,
      coverLetter,
      quote,
      appliedAt: new Date(),
    });

    await job.save();

    // Notify client
    const io = req.app.get('io');
    const clientId = job.client._id.toString();

    await Notification.create({
      userType: 'Client',
      userId: clientId,
      title: 'New Expert Application',
      message: `An expert has applied to your job "${job.title}".`,
      jobId: job._id,
      read: false,
    });

    if (io) {
      io.to(`client_${clientId}`).emit('client:new_application', {
        jobId: job._id,
        title: job.title,
      });
    }

    // Send email to client
    await sendEmail({
      to: job.client.email,
      subject: 'New Expert Application Received',
      html: `
        <h2>New Application for Your Job</h2>
        <p>Your job "<strong>${job.title}</strong>" has a new application from an expert.</p>
        <p><strong>Quote:</strong> ${quote}</p>
        <p><strong>Cover Letter:</strong> ${coverLetter}</p>
        <p><a href="https://your-frontend-domain/client/jobs/${job._id}">View Job Applications</a></p>
      `,
    });

    res.json({ success: true, message: 'Applied successfully', job });
  } catch (err) {
    console.error('applyForJob error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
