import Job from '../../models/client/Job.js';
import Client from '../../models/client/Client.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';
import path from 'path';

/**
 * @desc Client posts a job (admin review)
 * @route POST /api/client/jobs
 * @access Private (client only)
 */
export const createJob = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware

    // Ensure client profile exists
    if (!user.profile) {
      return res.status(400).json({
        success: false,
        message: 'Client profile not found. Please complete your profile.',
      });
    }

    const client = await Client.findById(user.profile, 'name email phone');
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: 'Client not found' });
    }

    const { title, description, deadline, budget } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and deadline are required.',
      });
    }

    // Handle uploaded attachments
    let attachmentFiles = [];
    if (req.files && req.files.length > 0) {
      attachmentFiles = req.files.map((file) =>
        path.join('uploads/jobs', file.filename)
      );
    }

    // Create job with admin-only fields null
    const job = await Job.create({
      client: client._id,
      title,
      description,
      deadline: new Date(deadline),
      clientProposedPrice: budget || null,
      attachments: attachmentFiles,
      status: 'pending_admin_review',
      branch: null,
      category: null,
      skillsRequired: [],
      pricingRange: { min: 0, max: 0 },
    });

    const jobWithClient = { ...job.toObject(), client };

    // Notify admin
    await Notification.create({
      userType: 'Admin',
      userId: null,
      title: 'New Job Posted',
      message: `A new job titled "${job.title}" requires review.`,
      jobId: job._id,
      read: false,
    });

    // Emit Socket.IO to admins
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('admin:new_job', {
        jobId: job._id,
        title: job.title,
        client: {
          name: client.name,
          email: client.email,
          phone: client.phone,
        },
      });
    }

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Awaiting Review',
      html: `
        <h2>New Job Submitted</h2>
        <p><strong>Title:</strong> ${job.title}</p>
        <p><strong>Client:</strong> ${client.name}</p>
        <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${client.phone || 'N/A'}</p>
        <p>This job is awaiting review in the admin dashboard.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Job submitted successfully. Awaiting admin approval.',
      job: jobWithClient,
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
