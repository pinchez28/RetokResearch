import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import { mapExpertAssignmentDTO } from '../../dtos/expert/expert.assignment.dto.js';
import mongoose from 'mongoose';

/* =======================================================
   GET AVAILABLE JOBS (EXPERT FEED)
   - Exclude jobs where expert already applied
   - Only approved_for_bidding jobs
======================================================= */
export const getAvailableJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const expert = await Expert.findOne({ user: userId }).select('_id');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert profile not found' });

    const jobs = await Job.find({
      status: 'approved_for_bidding',
      hiredExpertId: null,
      applications: { $not: { $elemMatch: { expert: expert._id } } },
    })
      .populate('client', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      jobs: jobs.map((j) => ({ ...j, hasApplied: false })),
    });
  } catch (error) {
    console.error('getAvailableJobs error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch available jobs' });
  }
};

/* =======================================================
   GET JOB DETAILS (EXPERT VIEW)
   - Include myProposal if already applied
   - Include finalWorkUrl & deliveredWorkAttachments
======================================================= */
export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const expert = await Expert.findOne({ user: userId }).select('_id');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert profile not found' });

    const job = await Job.findById(jobId)
      .populate('client', 'name')
      .populate('hiredExpertId', 'name photo specialization rating')
      .lean();

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    const hasApplied = job.applications?.some(
      (app) => app.expert?.toString() === expert._id.toString(),
    );

    const myProposal = hasApplied
      ? (() => {
          const app = job.applications.find(
            (a) => a.expert?.toString() === expert._id.toString(),
          );
          return {
            _id: app._id,
            proposalText: app.proposalText,
            quote: app.quote,
            estimatedDeliveryDays: app.estimatedDeliveryDays,
            status: app.status,
            submittedAt: app.submittedAt,
            expertSnapshot: app.expertSnapshot,
          };
        })()
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...job,
        hasApplied,
        applicationsCount: job.applications?.length || 0,
        myProposal,
        finalWorkUrl: job.finalWorkUrl || null,
        deliveredWorkAttachments: job.deliveredWorkAttachments || [],
      },
    });
  } catch (error) {
    console.error('getJobDetails error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch job details' });
  }
};

/* =======================================================
   APPLY FOR JOB
======================================================= */
export const applyForJob = async (req, res) => {
  let session = null;

  try {
    const { jobId } = req.params;
    const { proposalText, quote, estimatedDeliveryDays } = req.body;
    const expertProfileId = req.user.profile._id;

    // Optional: start a session for transactions
    if (mongoose.connection.client.topology?.description?.type !== 'Single') {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    // Load job
    const job = await Job.findById(jobId).session(session);
    if (!job) throw new Error('Job not found');

    // Load expert profile for snapshot
    const expert = await Expert.findOne({ user: req.user._id }).session(
      session,
    );
    if (!expert) throw new Error('Expert profile not found');

    // Add application with expertSnapshot
    job.applications.push({
      expert: expertProfileId,
      proposalText,
      quote,
      estimatedDeliveryDays,
      submittedAt: new Date(),
      status: 'pending',
      expertSnapshot: {
        expertId: expert._id,
        name: expert.name,
        photo: expert.photo || '',
        specialization: expert.specialization || '',
        experience: expert.experience || 0,
        education: expert.education || '',
        certifications: expert.certifications || [],
        bio: expert.bio || '',
        rating: expert.rating || 0,
      },
    });

    await job.save({ session });

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    res.json({
      success: true,
      message: 'Proposal submitted successfully',
      job,
    });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('applyForJob error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

/* =======================================================
   GET EXPERT PROJECTS (Completed Assignments Only)
   - Include finalWorkUrl and deliveredWorkAttachments
======================================================= */
export const getExpertProjects = async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id }).select('_id');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    const completedAssignments = await Job.find({
      hiredExpertId: expert._id,
      status: 'completed',
    })
      .populate('client', 'name')
      .lean();

    const assignments = completedAssignments.map((job) =>
      mapExpertAssignmentDTO(
        {
          _id: job._id,
          job,
          title: job.title,
          description: job.description,
          budget: job.budget,
          dueDate: job.deadline,
          client: job.client,
        },
        { chatThreadId: null },
      ),
    );

    res.status(200).json({ success: true, data: assignments });
  } catch (err) {
    console.error('getExpertProjects error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch completed projects' });
  }
};

/* =======================================================
   GET EXPERT PROPOSALS
   - Includes status and snapshot
======================================================= */
export const getExpertProposals = async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id }).select('_id');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    const jobs = await Job.find({ 'applications.expert': expert._id })
      .populate('client', 'name')
      .lean();

    const proposals = [];
    for (const job of jobs) {
      for (const app of job.applications) {
        if (app.expert.toString() === expert._id.toString()) {
          proposals.push({
            _id: app._id,
            job: { _id: job._id, title: job.title, status: job.status },
            proposalText: app.proposalText,
            quote: app.quote,
            status: app.status,
            submittedAt: app.submittedAt,
            finalWorkUrl: job.finalWorkUrl || null,
            deliveredWorkAttachments: job.deliveredWorkAttachments || [],
          });
        }
      }
    }

    res.status(200).json({ success: true, data: proposals });
  } catch (err) {
    console.error('getExpertProposals error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch proposals' });
  }
};
