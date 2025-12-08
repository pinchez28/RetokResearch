import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/Proposal.js';
import Client from '../../models/client/Client.js';
import Notification from '../../models/Notification.js';
import path from 'path';
import sendEmail from '../../../utils/sendEmail.js';

// ---------------- Get Jobs for Client ----------------
export const getClientJobs = async (req, res) => {
  try {
    const clientId = req.user.profile;

    // Fetch client jobs
    const jobs = await Job.find({ client: clientId })
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email' },
      })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    // Populate applications for each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Proposal.find({ job: job._id })
          .populate('expert', 'profile.name profile.photo')
          .lean({ virtuals: true });

        return {
          ...job,
          applications,
        };
      })
    );

    res.json({ success: true, jobs: jobsWithApplications });
  } catch (err) {
    console.error('Get client jobs error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ---------------- Create Job ----------------
export const createJob = async (req, res) => {
  try {
    const user = req.user;

    if (!user.profile) {
      return res.status(400).json({
        success: false,
        message: 'Client profile not found. Please complete your profile.',
      });
    }

    const clientProfile = await Client.findById(user.profile)
      .populate('user', 'email')
      .lean({ virtuals: true });

    if (!clientProfile) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const { title, description, deadline, budget } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and deadline are required.',
      });
    }

    const attachmentFiles =
      req.files?.map((f) => path.join('uploads/jobs', f.filename)) || [];

    const job = await Job.create({
      client: user.profile, // Link to Client, not User
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

    // -------------------------------
    // ✅ Apply your REQUIRED FIX HERE
    // -------------------------------
    const populatedJob = await Job.findById(job._id)
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email' },
      })
      .lean({ virtuals: true });
    // -------------------------------

    // Notify Admin
    await Notification.create({
      userType: 'Admin',
      userId: null,
      title: 'New Job Posted',
      message: `A new job titled "${job.title}" requires review.`,
      jobId: job._id,
      read: false,
    });

    const io = req.app.get('io');
    if (io)
      io.to('admins').emit('admin:new_job', {
        jobId: job._id,
        title: job.title,
      });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Awaiting Review',
      html: `<h2>New Job Submitted</h2><p>Title: ${job.title}</p>`,
    });

    // -------------------------------
    // ✅ Respond using POPULATED JOB
    // -------------------------------
    res.status(201).json({
      success: true,
      message: 'Job submitted successfully. Awaiting admin approval.',
      job: populatedJob,
      clientEmail: clientProfile.user?.email,
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
