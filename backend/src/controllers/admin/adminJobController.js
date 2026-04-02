import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/notification/Notification.js';
import { assignJobToExpert } from '../../helpers/assignJobToExpertHelper.js';
import sendEmail from '../../../utils/sendEmail.js';
import Proposal from '../../models/expert/ExpertProposal.js';
import ChatThread from '../../models/chat/ChatThread.js';
import Assignment from '../../models/expert/ExpertAssignment.js';
import Project from '../../models/client/Project.js';
import ExpertAssignment from '../../models/expert/ExpertAssignment.js';
import ClientProject from '../../models/client/ClientProject.js';
import mongoose from 'mongoose';

/* =====================================================
   1. GET ALL JOBS (ADMIN OVERVIEW)
===================================================== */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('client', 'name email')
      .populate('hiredExpertId', 'name email specialization')
      .populate({
        path: 'applications.expert',
        select: 'name email phone rating specialization',
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error('getAllJobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

/* =====================================================
   2. GET ACTIVE JOBS (EXCLUDE COMPLETED)
===================================================== */
export const getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: { $ne: 'completed' }, // only exclude completed jobs
    })
      .populate('client', 'name email')
      .populate('hiredExpertId', 'name email specialization')
      .populate({
        path: 'applications.expert',
        select: 'name phone email rating specialization',
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    console.error('getActiveJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active jobs',
    });
  }
};

/* =====================================================
   3. GET PENDING JOBS (ADMIN REVIEW QUEUE)
===================================================== */
export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending_admin_review' })
      .populate({
        path: 'client',
        select: 'name phone',
        populate: { path: 'user', select: 'email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error('getPendingJobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// Get active job details (for admin view)
export const getActiveJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1️⃣ Fetch job and populate client
    const job = await Job.findById(jobId)
      .populate({ path: 'client', select: '_id name phone' })
      .lean();
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // 2️⃣ Build applications with expertSnapshot manually
    const applications =
      job.applications?.map((app) => ({
        ...app,
        expertSnapshot: {
          expertId: app.expert,
          // Fetch expert info (name, photo, etc.)
          ...(app.expertSnapshot || {}), // fallback in case already present
        },
      })) || [];

    // 3️⃣ Fetch assignment for this job
    const assignment = await ExpertAssignment.findOne({ job: jobId })
      .populate({
        path: 'expert',
        select: '_id name phone photo specialization bio cvPdf',
      })
      .populate({ path: 'chatThreadId' })
      .lean();

    // 4️⃣ Fetch client project if exists
    const project = await ClientProject.findOne({ job: jobId })
      .populate({
        path: 'expert',
        select:
          '_id name phone photo specialization bio cvPdf pendingUpdates status',
      })
      .populate({ path: 'client' })
      .populate({ path: 'assignment' })
      .lean();

    return res.json({
      success: true,
      data: {
        job: { ...job, applications },
        assignment,
        project,
      },
    });
  } catch (err) {
    console.error('getActiveJobDetails error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job details',
      error: err.message,
    });
  }
};
/* =====================================================
   4. JOB SUMMARY (ADMIN DASHBOARD)
===================================================== */
export const getJobsSummary = async (req, res) => {
  try {
    const [total, pending, approved, active, completed] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'pending_admin_review' }),
      Job.countDocuments({ status: 'approved_for_bidding' }),
      Job.countDocuments({
        status: { $in: ['assigned', 'in_progress', 'in_review'] },
      }),
      Job.countDocuments({ status: 'completed' }),
    ]);

    res.status(200).json({
      success: true,
      total,
      pending,
      approved,
      active,
      completed,
    });
  } catch (err) {
    console.error('getJobsSummary error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =====================================================
   5. GET SINGLE JOB (ADMIN VIEW)
===================================================== */
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Job ID' });
    }

    /* ================= JOB ================= */
    const job = await Job.findById(jobId)
      .populate({
        path: 'client',
        select: 'name phone',
        populate: { path: 'user', select: 'email phone' },
      })
      .populate({
        path: 'hiredExpertId',
        select: 'name specialization rating phone',
        populate: { path: 'user', select: 'email phone' },
      })
      .lean();

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Flatten client phone/email for frontend
    if (job.client) {
      job.client.email = job.client.user?.email || null;
      job.client.phone = job.client.phone || job.client.user?.phone || null;
    }

    // Flatten expert phone/email for frontend
    if (job.hiredExpertId) {
      job.hiredExpertId.email = job.hiredExpertId.user?.email || null;
      job.hiredExpertId.phone =
        job.hiredExpertId.phone || job.hiredExpertId.user?.phone || null;
    }

    /* ================= PROPOSAL ================= */
    const proposal =
      job.applications?.find((a) => a.status === 'accepted') || null;

    /* ================= ASSIGNMENT ================= */
    const assignment = await Assignment.findOne({ job: job._id })
      .populate({
        path: 'expert',
        select: 'name specialization rating phone',
        populate: { path: 'user', select: 'email phone' },
      })
      .populate({
        path: 'client',
        select: 'name phone',
        populate: { path: 'user', select: 'email phone' },
      })
      .lean();

    if (assignment?.expert) {
      assignment.expert.email = assignment.expert.user?.email || null;
      assignment.expert.phone =
        assignment.expert.phone || assignment.expert.user?.phone || null;
    }

    if (assignment?.client) {
      assignment.client.email = assignment.client.user?.email || null;
      assignment.client.phone =
        assignment.client.phone || assignment.client.user?.phone || null;
    }

    /* ================= CHAT ================= */
    let chatThread = await ChatThread.findOne({ job: job._id })
      .populate('clientUser', 'name email phone')
      .populate('expertUser', 'name email phone specialization')
      .populate('adminUser', 'name email')
      .lean();

    if (chatThread) {
      chatThread.allowedUserIds = [
        job.client?._id,
        job.hiredExpertId?._id,
        chatThread.adminUser?._id,
      ].filter(Boolean);
    }

    /* ================= RESPONSE ================= */
    res.status(200).json({
      success: true,
      data: { job, assignment, proposal, chatThread },
    });
  } catch (err) {
    console.error('ADMIN getJobById error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   6. REVIEW & APPROVE JOB (ADMIN)
===================================================== */
export const reviewJob = async (req, res) => {
  try {
    const { minPrice, maxPrice, branch, category } = req.body;

    if (!branch || !category || minPrice == null || maxPrice == null) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields required' });
    }

    if (minPrice > maxPrice) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid price range' });
    }

    // ✅ Atomic update — only update if still pending
    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.jobId,
        status: 'pending_admin_review', // prevents re-review
      },
      {
        pricingRange: { min: minPrice, max: maxPrice },
        branch,
        category,
        status: 'approved_for_bidding',
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
      },
      { new: true }, // return updated doc
    ).lean();

    if (!job) {
      return res.status(400).json({
        success: false,
        message: 'Job not found or already reviewed',
      });
    }

    // 🔎 Fetch client email only (light query)
    const jobWithClient = await Job.findById(job._id)
      .select('title client')
      .populate({
        path: 'client',
        select: 'user',
        populate: { path: 'user', select: 'email' },
      })
      .lean();

    // 🚀 Create notification (don't block response)
    Notification.create({
      userType: 'Client',
      userId: jobWithClient.client._id,
      title: 'Job Approved',
      message: `Your job "${jobWithClient.title}" is now open for bidding.`,
      jobId: job._id,
    }).catch(console.error);

    // 🚀 Send email asynchronously
    if (jobWithClient.client?.user?.email) {
      sendEmail({
        to: jobWithClient.client.user.email,
        subject: 'Job Approved',
        html: `<p>Your job <b>${jobWithClient.title}</b> has been approved.</p>`,
      }).catch(console.error);
    }

    // ✅ Respond immediately (do not wait for email/notification)
    return res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('reviewJob error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   7. REJECT JOB (ADMIN)
===================================================== */
export const rejectJob = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason)
      return res
        .status(400)
        .json({ success: false, message: 'Reason required' });

    const job = await Job.findById(req.params.jobId).populate({
      path: 'client',
      populate: { path: 'user', select: 'email' },
    });

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = 'admin_rejected';
    job.rejectionReason = reason;
    job.rejectedAt = new Date();

    await job.save();

    await Notification.create({
      userType: 'Client',
      userId: job.client._id,
      title: 'Job Rejected',
      message: reason,
      jobId: job._id,
    });

    if (job.client?.user?.email) {
      await sendEmail({
        to: job.client.user.email,
        subject: 'Job Rejected',
        html: `<p>Your job "${job.title}" was rejected.</p><p>${reason}</p>`,
      });
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('rejectJob error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   7B. APPROVE FINAL WORK / REVISION (ADMIN)
===================================================== */
export const approveWork = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Job ID' });
    }

    const job = await Job.findById(jobId).populate('client hiredExpertId');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!['ready', 'in_review'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: 'Job is not ready for approval',
      });
    }

    job.status = 'completed';
    job.completedAt = new Date();
    await job.save();

    // Notify client
    await Notification.create({
      userType: 'Client',
      userId: job.client._id,
      title: 'Work Approved',
      message: `Your job "${job.title}" has been approved by the admin.`,
      jobId: job._id,
    });

    // Notify expert
    if (job.hiredExpertId) {
      await Notification.create({
        userType: 'Expert',
        userId: job.hiredExpertId._id,
        title: 'Work Approved',
        message: `Your submission for "${job.title}" has been approved by the admin.`,
        jobId: job._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job work approved successfully',
      data: job,
    });
  } catch (err) {
    console.error('approveWork error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   8. GET APPROVED EXPERTS LIST
===================================================== */
export const getApprovedExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ status: 'approved' })
      .populate('user', 'email')
      .select('name specialization rating totalJobs completedJobs user')
      .sort({ rating: -1 })
      .lean();

    res.status(200).json({ success: true, data: experts });
  } catch (err) {
    console.error('getApprovedExperts error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   9. ADMIN OVERRIDE (REASSIGN / UNLOCK)
===================================================== */
export const adminOverrideAssignment = async (req, res) => {
  try {
    const { expertId, reason } = req.body;

    const job = await Job.findById(req.params.jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (!['assigned', 'in_progress'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: 'Job not eligible for reassignment',
      });
    }

    job.hiredExpertId = expertId || null;
    job.hiredApplicationId = null;
    job.status = expertId ? 'assigned' : 'approved_for_bidding';
    job.reassignmentLocked = false;
    job.adminOverrideReason = reason || 'Admin override';

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Admin override applied',
      data: job,
    });
  } catch (err) {
    console.error('adminOverrideAssignment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   10. DELETE JOB (ADMIN)
===================================================== */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    res
      .status(200)
      .json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('deleteJob error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =====================================================
   11. COMPLETED JOBS
===================================================== */
export const getCompletedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'completed' })
      .populate('client', 'name email')
      .populate('hiredExpertId', 'name email')
      .lean();

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error('getCompletedJobs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =====================================================
   12. ASSIGN EXPERT TO JOB (ADMIN)
===================================================== */
export const assignExpertToJob = async (req, res) => {
  try {
    const { expertId } = req.body;

    if (!expertId) {
      return res
        .status(400)
        .json({ success: false, message: 'Expert ID is required' });
    }

    const job = await Job.findById(req.params.jobId).populate({
      path: 'client',
      populate: { path: 'user', select: 'email phone' },
    });

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.hiredExpertId) {
      return res.status(400).json({
        success: false,
        message: 'Job already has an assigned expert',
      });
    }

    const expert = await Expert.findById(expertId).populate(
      'user',
      'email phone',
    );
    if (!expert || expert.status !== 'approved') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid expert' });
    }

    const { assignment, chatThread } = await assignJobToExpert(
      job,
      expert,
      req.user,
    );

    const populatedJob = await Job.findById(job._id)
      .populate({
        path: 'client',
        populate: { path: 'user', select: 'email phone' },
      })
      .populate({
        path: 'hiredExpertId',
        select: 'name email specialization rating',
        populate: { path: 'user', select: 'email phone' },
      })
      .lean();

    populatedJob.assignedExpert = {
      name: expert.name,
      email: expert.email || expert.user?.email,
      phone: expert.user?.phone || null,
      specialization: expert.specialization,
      rating: expert.rating,
    };

    res.status(200).json({
      success: true,
      message: 'Expert assigned successfully',
      data: populatedJob,
      assignmentId: assignment._id,
      chatThreadId: chatThread._id,
    });
  } catch (err) {
    console.error('assignExpertToJob error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
