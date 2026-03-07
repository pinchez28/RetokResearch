import mongoose from 'mongoose';
import Job from '../../models/client/Job.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import Assignment from '../../models/expert/ExpertAssignment.js';
import { assignJobToExpert } from '../../helpers/assignJobToExpertHelper.js';
import { notify } from '../../services/notificationService.js';

/* =======================================================
   GET CLIENT JOBS
   (All jobs the client has created)
======================================================= */
export const getClientJobs = async (req, res) => {
  try {
    const clientId = req.user.profile._id;

    const jobs = await Job.find({ client: clientId })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.json({ success: true, jobs });
  } catch (err) {
    console.error('[ERROR] getClientJobs:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =======================================================
   GET SINGLE JOB
======================================================= */
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.profile._id;

    const job = await Job.findOne({ _id: jobId, client: clientId })
      .populate('hiredExpert', 'name photo specialization cvPdf')
      .populate('applications.expert', 'name photo specialization cvPdf')
      .lean({ virtuals: true });

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // Transform applications
    job.applications = job.applications.map((app) => ({
      _id: app._id.toString(),
      expertSnapshot: {
        expertId: app.expert?._id?.toString() || null,
        name: app.expert?.name || 'Unknown',
        photo: app.expert?.photo || null,
        specialization: app.expert?.specialization || 'Expert',
        cvPdf: app.expert?.cvPdf || null,
      },
      quote: app.quote,
      proposalText: app.proposalText,
      estimatedDeliveryDays: app.estimatedDeliveryDays, // ✅ ADD THIS
      status: app.status,
      submittedAt: app.submittedAt,
    }));

    if (job.hiredExpert) {
      job.hiredExpert = {
        _id: job.hiredExpert._id.toString(),
        name: job.hiredExpert.name,
        photo: job.hiredExpert.photo,
        specialization: job.hiredExpert.specialization,
        cvPdf: job.hiredExpert.cvPdf,
      };
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error('[ERROR] getJobById:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =======================================================
   CREATE JOB
======================================================= */
export const createJob = async (req, res) => {
  try {
    const clientId = req.user.profile._id;
    const { title, description, deadline, budget } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and deadline are required',
      });
    }

    const job = await Job.create({
      client: clientId,
      title,
      description,
      deadline: new Date(deadline),
      clientProposedPrice: budget || null,
      status: 'pending_admin_review',
    });

    // Notify admins
    await notify({
      userType: 'Admin',
      title: 'New Job Posted',
      message: `New job "${job.title}" requires review`,
      jobId: job._id,
      io: req.app.get('io'),
      email: true,
      sms: true,
    });

    res
      .status(201)
      .json({ success: true, message: 'Job submitted successfully', job });
  } catch (err) {
    console.error('[ERROR] createJob:', err);
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
};

/**
 * Client hires an expert for a job
 */
export const clientHireExpert = async (req, res) => {
  let session = null;

  try {
    const { jobId } = req.params;
    const { expertId, applicationId } = req.body;
    const clientProfileId = req.user.profile._id;

    console.log('================ HIRE DEBUG START ================');
    console.log('[REQ] jobId:', jobId);
    console.log('[REQ] expertId:', expertId);
    console.log('[REQ] applicationId:', applicationId);
    console.log('[REQ] clientProfileId:', clientProfileId);

    const supportsTransactions =
      mongoose.connection.client.topology?.description?.type !== 'Single';

    if (supportsTransactions) {
      session = await mongoose.startSession();
      session.startTransaction();
      console.log('[DEBUG] MongoDB session started');
    }

    /* ---------------- 1️⃣ Load Job ---------------- */
    const job = await Job.findOne({
      _id: jobId,
      client: clientProfileId,
      status: 'approved_for_bidding', // only hireable jobs
    })
      .populate('applications.expert', 'user name photo specialization cvPdf') // crucial
      .session(session);

    console.log('[DEBUG] Job loaded:', !!job);
    if (!job) throw new Error('Job not found or not open for hiring');

    /* ---------------- 2️⃣ Check if already hired ---------------- */
    if (job.hiredApplicationId) {
      const assignment = await Assignment.findOne({ job: job._id })
        .populate('project')
        .session(session);

      console.log('[DEBUG] Already hired assignment:', assignment?._id || null);

      if (!assignment) {
        return res.status(500).json({
          success: false,
          message: 'Data inconsistency: hired job has no assignment',
        });
      }

      return res.json({
        success: true,
        message: 'Expert already hired for this job',
        assignment,
      });
    }

    /* ---------------- 3️⃣ Validate Application ---------------- */
    const application = job.applications.id(applicationId);
    if (!application) throw new Error('Application not found');
    if (!application.expert) throw new Error('Application expert missing');
    if (application.expert._id.toString() !== expertId)
      throw new Error('Expert mismatch');
    if (!application.estimatedDeliveryDays)
      throw new Error('Delivery time missing');

    console.log('[DEBUG] Application validated:', application._id);

    // Lock application
    job.applications.forEach((app) => {
      if (app._id.equals(application._id)) {
        app.status = 'accepted';
        app.respondedAt = new Date();
        app.messageFlowAllowed = false;
      } else {
        app.status = 'rejected';
      }
    });

    job.hiredApplicationId = application._id;

    /* ---------------- 4️⃣ Assign Job ---------------- */
    const { assignment, project } = await assignJobToExpert({
      job,
      expertUserId: application.expert.user._id, // populated field
      clientUserId: req.user._id,
      assignedByUserId: req.user._id,
      quote: application.quote,
      deliveryTime: application.estimatedDeliveryDays,
      session,
    });

    console.log('[DEBUG] Assignment created:', assignment._id);
    console.log('[DEBUG] ClientProject created:', project._id);
    console.log('[DEBUG] ClientProject finalCost:', project.finalCost);

    if (session) {
      await session.commitTransaction();
      session.endSession();
      console.log('[DEBUG] MongoDB session committed');
    }

    console.log('================ HIRE DEBUG END ==================');

    return res.json({
      success: true,
      message: 'Expert hired successfully',
      assignment,
      project,
    });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
      console.log('[DEBUG] MongoDB session aborted');
    }

    console.error('[clientHireExpert ERROR]', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Hire failed',
    });
  }
};
