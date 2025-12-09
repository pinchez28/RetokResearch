import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/ExpertProposal.js';
import Client from '../../models/client/Client.js';
import Notification from '../../models/notification/Notification.js';
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
          .populate({
            path: 'expert',
            populate: {
              path: 'profile',
              select:
                'name photo phone specialization bio experience education certifications portfolio',
            },
          })
          .lean({ virtuals: true });

        // Build expertSnapshot for frontend
        const appsWithSnapshot = applications.map((app) => {
          const profile = app.expert?.profile || {};
          return {
            ...app,
            expertSnapshot: {
              _id: app.expert?._id || null,
              name: profile.name || 'Unknown',
              phone: profile.phone || '—',
              photo: profile.photo || null,
              specialization: profile.specialization || '—',
              bio: profile.bio || '—',
              experience: profile.experience || '0',
              education: profile.education || '—',
              certifications: profile.certifications || [],
              portfolio: profile.portfolio || [],
            },
          };
        });

        return {
          ...job,
          applications: appsWithSnapshot,
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

// ---------------- Get Single Job by ID ----------------

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Populate client and assignedExpert.profile
    const job = await Job.findById(jobId)
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email' },
      })
      .populate({
        path: 'assignedExpert',
        populate: {
          path: 'profile',
          select:
            'name photo phone specialization bio experience education certifications portfolio',
        },
      })
      .lean({ virtuals: true });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Populate proposals/applications
    const applications = await Proposal.find({ job: job._id })
      .populate({
        path: 'expert',
        populate: {
          path: 'profile',
          select:
            'name photo phone specialization bio experience education certifications portfolio',
        },
      })
      .lean({ virtuals: true });

    const appsWithSnapshot = applications.map((app) => {
      const profile = app.expert?.profile || {};
      return {
        ...app,
        expertSnapshot: {
          _id: app.expert?._id || null,
          name: profile.name || 'Unknown',
          phone: profile.phone || '—',
          photo: profile.photo || null,
          specialization: profile.specialization || '—',
          bio: profile.bio || '—',
          experience: profile.experience || '0',
          education: profile.education || '—',
          certifications: profile.certifications || [],
          portfolio: profile.portfolio || [],
        },
      };
    });

    // Include applications in response
    job.applications = appsWithSnapshot;

    res.json({ success: true, job, messages: job.messages || [] });
  } catch (err) {
    console.error('getJobById error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
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

    const { title, description, deadline, budget, attachments } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and deadline are required.',
      });
    }

    // Allow client to attach files
    const attachmentFiles =
      req.files?.map((f) => path.join('uploads/jobs', f.filename)) ||
      attachments ||
      [];

    // Create job with branch, category, and skills left null/empty
    const job = await Job.create({
      client: user.profile,
      title,
      description,
      deadline: new Date(deadline),
      clientProposedPrice: budget || null,
      attachments: attachmentFiles,
      status: 'pending_admin_review',
      branch: null, // Admin sets this later
      category: null, // Admin sets this later
      skillsRequired: [], // Admin sets required skills later
      pricingRange: { min: 0, max: 0 },
    });

    const populatedJob = await Job.findById(job._id)
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email' },
      })
      .lean({ virtuals: true });

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
    if (io) {
      io.to('admins').emit('admin:new_job', {
        jobId: job._id,
        title: job.title,
      });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Job Awaiting Review',
      html: `<h2>New Job Submitted</h2><p>Title: ${job.title}</p>`,
    });

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

// ---------------- Hire / Assign Expert ----------------
export const hireExpert = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { expertId, applicationId } = req.body;

    if (!jobId || !expertId || !applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing job, expert, or application ID',
      });
    }

    // Fetch job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // 🔥 FIX: Save the correct fields matching frontend
    job.hiredExpertId = expertId;
    job.hiredApplicationId = applicationId;
    job.status = 'in_progress';

    await job.save();

    // Update proposal status
    await Proposal.findByIdAndUpdate(applicationId, {
      status: 'accepted',
    });

    const updatedJob = await Job.findById(jobId)
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email' },
      })
      .lean({ virtuals: true });

    res.json({
      success: true,
      message: 'Expert successfully hired',
      job: updatedJob,
    });
  } catch (err) {
    console.error('hireExpert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to hire expert',
      error: err.message,
    });
  }
};
