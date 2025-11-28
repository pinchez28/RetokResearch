import Job from '../../models/client/Job.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * @desc Client posts a job (goes to admin first)
 * @route POST /api/client/jobs
 * @access Private (client only)
 */

export const createJob = async (req, res) => {
  try {
    const clientId = req.user.id;

    const {
      title,
      description,
      category,
      skillsRequired,
      deadline,
      attachments,
    } = req.body;

    // 1. Create job with status "pending_admin_review"
    const job = await Job.create({
      client: clientId,
      title,
      description,
      category,
      skillsRequired,
      deadline,
      attachments: attachments || [],
      status: 'pending_admin_review',
      createdAt: new Date(),
    });

    // 2. Create notification for ADMIN
    await Notification.create({
      userType: 'admin',
      userId: null,
      title: 'New Job Posted',
      message: `A new job titled "${job.title}" requires review.`,
      jobId: job._id,
      read: false,
    });

    // 3. Emit Socket.IO event to admins
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('admin:new_job', {
        jobId: job._id,
        title: job.title,
        category: job.category,
      });
    }

    // 4. Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Awaiting Review',
      html: `
        <h2>New Job Submitted</h2>
        <p><strong>Title:</strong> ${job.title}</p>
        <p><strong>Category:</strong> ${job.category}</p>
        <p>This job is awaiting your review in the dashboard.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Job submitted successfully. Awaiting admin approval.',
      job,
    });
  } catch (err) {
    console.error('createJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: err.message,
    });
  }
};
