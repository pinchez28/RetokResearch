import Job from '../../models/client/Job.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * @desc Get all jobs assigned to the expert (approved_for_bidding)
 * @route GET /api/expert/jobs
 * @access Private (expert only)
 */
export const getAvailableJobs = async (req, res) => {
  try {
    const expertId = req.user.id;

    const jobs = await Job.find({
      status: 'approved_for_bidding',
      approvedExperts: expertId,
    }).sort({ createdAt: -1 });

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

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // Create applications array if it doesn't exist
    if (!job.applications) job.applications = [];

    // Add expert application
    job.applications.push({
      expert: expertId,
      coverLetter,
      quote,
      appliedAt: new Date(),
    });

    await job.save();

    // Notify client
    const io = req.app.get('io');
    const clientId = job.client.toString();

    await Notification.create({
      userType: 'client',
      userId: clientId,
      title: 'New Expert Application',
      message: `An expert has applied to your job "${job.title}"`,
      jobId: job._id,
      read: false,
    });

    if (io) {
      io.to(`client_${clientId}`).emit('client:new_application', {
        jobId: job._id,
        title: job.title,
      });
    }

    // Send client email
    await sendEmail({
      to: job.clientEmail, // Make sure Job model stores client email, or fetch from Client model
      subject: 'New Expert Application Received',
      html: `
        <h2>New Application for Your Job</h2>
        <p>Your job "<strong>${job.title}</strong>" has a new application from an expert.</p>
        <p>Quote: ${quote}</p>
        <p>Cover Letter: ${coverLetter}</p>
        <p><a href="https://your-frontend-domain/client/jobs/${job._id}">View Job Applications</a></p>
      `,
    });

    res.json({ success: true, message: 'Applied successfully', job });
  } catch (err) {
    console.error('applyForJob error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
