import Job from '../../models/client/Job.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';
import path from 'path';

/**
 * @desc Client posts a job (goes to admin first)
 * @route POST /api/client/jobs
 * @access Private (client only)
 */
export const createJob = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { title, description, deadline, budget } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    // Process uploaded files
    let attachmentFiles = [];
    if (req.files && req.files.length > 0) {
      attachmentFiles = req.files.map((file) =>
        path.join('uploads/jobs', file.filename)
      );
    }

    // Create job (client fields only)
    const job = await Job.create({
      client: clientId,
      title,
      description,
      deadline: deadline ? new Date(deadline) : null,
      clientProposedPrice: budget || null, // optional
      attachments: attachmentFiles,
      status: 'pending_admin_review',
    });

    // Notify admin
    await Notification.create({
      userType: 'Admin',
      userId: null,
      title: 'New Job Posted',
      message: `A new job titled "${job.title}" requires review.`,
      jobId: job._id,
      read: false,
    });

    // Socket.IO emit
    const io = req.app.get('io');
    if (io)
      io.to('admins').emit('admin:new_job', {
        jobId: job._id,
        title: job.title,
      });

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Awaiting Review',
      html: `
        <h2>New Job Submitted</h2>
        <p><strong>Title:</strong> ${job.title}</p>
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
