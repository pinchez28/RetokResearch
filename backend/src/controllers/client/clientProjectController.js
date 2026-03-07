import mongoose from 'mongoose';
import Job from '../../models/client/Job.js';
import ExpertAssignment from '../../models/expert/ExpertAssignment.js';
import ChatThread from '../../models/chat/ChatThread.js';
import User from '../../models/auth/User.js';
import Expert from '../../models/expert/Expert.js';
import Client from '../../models/client/Client.js';
import Notification from '../../models/notification/Notification.js';
import ClientProject from '../../models/client/ClientProject.js';
import Assignment from '../../models/expert/ExpertAssignment.js';
import Payment from '../../models/client/Payment.js';
import { initiateStkPush } from '../../services/mpesa/stkService.js';
import { emitProjectDownloaded } from '../../sockets/index.js';
import path from 'path';
import fs from 'fs';

/* =======================================================
   UTILITY FUNCTION: CHECK CLIENT PAYMENT
======================================================= */
const canClientDownload = (job) => {
  return job.paymentConfirmed === true && job.status === 'ready';
};

const isWithinRevisionGracePeriod = (job) => {
  if (!job.downloadedAt) return false;
  const gracePeriodDays = 2;
  const graceEnd = new Date(job.downloadedAt);
  graceEnd.setDate(graceEnd.getDate() + gracePeriodDays);
  return new Date() <= graceEnd;
};

/* =======================================================
   GET ALL CLIENT PROJECTS
======================================================= */
export const getClientProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    /* 1️⃣ Resolve client profile */
    const client = await Client.findOne({ user: userId }).lean();
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client profile not found',
      });
    }

    /* 2️⃣ Fetch client projects */
    const projects = await ClientProject.find({
      client: client._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!projects.length) {
      return res.json({ success: true, data: [], total: 0 });
    }

    const jobIds = projects.map((p) => p.job);
    const assignmentIds = projects.map((p) => p.assignment);

    /* 3️⃣ Fetch related data */
    const jobs = await Job.find({ _id: { $in: jobIds } }).lean();
    const assignments = await Assignment.find({
      _id: { $in: assignmentIds },
    }).lean();

    const chats = await ChatThread.find({ job: { $in: jobIds } })
      .select('_id job')
      .lean();

    const jobMap = new Map(jobs.map((j) => [j._id.toString(), j]));
    const assignmentMap = new Map(
      assignments.map((a) => [a._id.toString(), a]),
    );
    const chatMap = new Map(chats.map((c) => [c.job.toString(), c._id]));

    /* 4️⃣ Shape frontend response */
    const response = await Promise.all(
      projects.map(async (project) => {
        const job = jobMap.get(project.job.toString());
        const assignment = assignmentMap.get(project.assignment.toString());

        let expertData = null;
        if (project.expert) {
          const expert = await Expert.findById(project.expert)
            .select('name photo specialization')
            .lean();

          expertData = expert
            ? {
                expertId: expert._id,
                name: expert.name,
                photo: expert.photo || null,
                specialization: expert.specialization,
              }
            : null;
        }

        return {
          _id: project._id,
          projectId: project._id,

          title: job?.title || 'Untitled ClientProject',
          description: job?.description || '',

          status: project.status,
          deadline: job?.deadline || null,

          expert: expertData,

          assignmentId: assignment?._id || null,
          chatThreadId: chatMap.get(project.job.toString()) || null,

          finalWorkUrl: job?.finalWorkUrl || null,
          deliveredWorkAttachments: job?.deliveredWorkAttachments || [],

          paymentConfirmed: project.paymentConfirmed,
          isPaid: project.isPaid,

          downloadedAt: project.downloadedAt,
          revisionRequestedAt: project.revisionRequestedAt,
          completedAt: project.completedAt,
        };
      }),
    );

    res.json({
      success: true,
      data: response,
      total: response.length,
    });
  } catch (err) {
    console.error('getClientProjects error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to load projects',
    });
  }
};

/* =======================================================
   GET SINGLE CLIENT PROJECT
======================================================= */

export const getClientProjectDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    /* 1️⃣ Resolve client profile */
    const client = await Client.findOne({ user: userId }).lean();
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client profile not found',
      });
    }

    /* 2️⃣ Fetch ClientProject (SOURCE OF TRUTH) */
    const project = await ClientProject.findOne({
      _id: projectId,
      client: client._id,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ClientProject not found for this client',
      });
    }

    /* 3️⃣ Fetch related Job */
    const job = await Job.findById(project.job).lean();

    /* 4️⃣ Fetch Assignment */
    const assignment = await Assignment.findById(project.assignment).lean();

    /* 5️⃣ Fetch Chat */
    const chatThread = await ChatThread.findOne({ job: project.job })
      .select('_id')
      .lean();

    /* 6️⃣ Fetch Expert */
    let expertData = null;
    if (project.expert) {
      const expert = await Expert.findById(project.expert)
        .select('name photo specialization')
        .lean();

      expertData = expert
        ? {
            expertId: expert._id,
            name: expert.name,
            photo: expert.photo || null,
            specialization: expert.specialization,
          }
        : null;
    }

    /* 7️⃣ Respond */
    res.json({
      success: true,
      project: {
        _id: project._id,
        projectId: project._id,

        title: job?.title || 'Untitled ClientProject',
        description: job?.description || '',

        status: project.status,
        dueDate: job?.deadline || null,

        budget: assignment?.budget || 0,
        deliveryTime: assignment?.deliveryTime || null,

        assignedAt: assignment?.createdAt || null,
        startedAt: assignment?.startedAt || null,
        submittedAt: assignment?.submittedAt || null,

        finalWorkUrl: job?.finalWorkUrl || null,
        deliveredWorkAttachments: job?.deliveredWorkAttachments || [],

        paymentConfirmed: project.paymentConfirmed,
        isPaid: project.isPaid,

        downloadedAt: project.downloadedAt,
        revisionRequestedAt: project.revisionRequestedAt,
        completedAt: project.completedAt,

        chatThreadId: chatThread?._id || null,
        expert: expertData,
      },
    });
  } catch (err) {
    console.error('getClientProjectDetails ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/* =======================================================
   CLIENT DOWNLOAD WORK
======================================================= */
export const downloadWork = async (req, res) => {
  try {
    const { projectId } = req.params;

    const clientProject = await ClientProject.findById(projectId);
    if (!clientProject)
      return res.status(404).json({ message: 'ClientProject not found' });

    if (clientProject.client.toString() !== req.user.profileId)
      return res.status(403).json({ message: 'Not your project' });

    if (!clientProject.isPaid)
      return res.status(403).json({ message: 'Payment not confirmed' });

    const job = await Job.findById(clientProject.job);
    if (!job)
      return res.status(404).json({ message: 'Associated job not found' });

    if (!job.canClientDownload)
      return res.status(403).json({ message: 'Download not yet available' });

    // 1️⃣ Make sure the file exists
    const filePath = path.join(
      process.cwd(),
      job.finalWorkUrl.replace(/^\/+/, ''),
    );

    console.log('Resolved file path:', filePath);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: 'File not found on server' });

    // 2️⃣ Mark project as downloaded
    clientProject.downloadedAt = new Date();
    clientProject.status = 'downloaded';
    await clientProject.save();

    // 3️⃣ Send the file (triggers Save As dialog)
    return res.download(filePath, path.basename(job.finalWorkUrl), (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Failed to download file' });
      }
    });
  } catch (err) {
    console.error('downloadWork error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

//* =======================================================
//   MARK PROJECT AS DOWNLOADED (FOR REAL-TIME UPDATES)
// ======================================================= */

export const markProjectDownloaded = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ClientProject.findById(projectId);
    if (!project)
      return res.status(404).json({ error: 'ClientProject not found' });

    // 1️⃣ Update ClientProject
    project.status = 'downloaded';
    project.downloadedAt = new Date();
    await project.save();

    // 2️⃣ Update Expert Assignment
    const assignment = await ExpertAssignment.findOne({ job: project._id });
    if (assignment) {
      assignment.status = 'downloaded';
      assignment.downloadedAt = new Date();
      await assignment.save();
    }

    // 3️⃣ Update Job
    const job = await Job.findById(project._id);
    if (job) {
      job.status = 'downloaded';
      job.downloadedAt = new Date();
      await job.save();
    }

    // 4️⃣ Emit socket event
    emitProjectDownloaded(project._id);

    res.json({ success: true, project, assignment, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark project as downloaded' });
  }
};

/* =======================================================
   CLIENT REQUESTS REVISION
   (ready → in_progress)
======================================================= */
export const requestRevision = async (req, res) => {
  try {
    const clientUserId = req.user._id;
    const { jobId } = req.params;
    const { note } = req.body;

    /* ======================================================
       1️⃣ FETCH JOB (OWNERSHIP)
    ====================================================== */
    const job = await Job.findOne({
      _id: jobId,
      client: req.user.profile._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    /* ======================================================
       2️⃣ STATE GUARDS
    ====================================================== */
    if (job.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Revision can only be requested after work is submitted',
      });
    }

    /* ======================================================
       3️⃣ DEADLINE GUARD
    ====================================================== */
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(403).json({
        success: false,
        message: 'Revision deadline has passed',
      });
    }

    /* ======================================================
       4️⃣ MOVE JOB BACK TO IN_PROGRESS
    ====================================================== */
    job.status = 'in_progress';
    job.revisionRequestedAt = new Date();
    await job.save();

    /* ======================================================
       5️⃣ MOVE ASSIGNMENT BACK TO IN_PROGRESS
    ====================================================== */
    const assignment = await Assignment.findOne({ job: job._id });
    if (assignment) {
      assignment.status = 'in_progress';
      assignment.revisionRequestedAt = new Date();
      await assignment.save();

      /* ======================================================
         6️⃣ NOTIFY EXPERT
      ====================================================== */
      await Notification.create({
        userType: 'Expert',
        userId: assignment.expert,
        title: 'Revision Requested',
        message: note || `Client requested a revision for "${job.title}"`,
        jobId: job._id,
      });
    }

    /* ======================================================
       7️⃣ NOTIFY ADMIN (OVERSIGHT)
    ====================================================== */
    await Notification.create({
      userType: 'Admin',
      title: 'Client Requested Revision',
      message: `Revision requested for job "${job.title}"`,
      jobId: job._id,
    });

    return res.json({
      success: true,
      message: 'Revision requested successfully',
      jobStatus: job.status,
    });
  } catch (err) {
    console.error('[client requestRevision]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * GET /api/client/projects/:projectId/payment-status
 * Returns the LATEST payment attempt for this project
 */
export const getProjectPaymentStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    /* 1️⃣ Validate project ID */
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    /* 2️⃣ Resolve client profile */
    const client = await Client.findOne({ user: userId }).lean();
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client profile not found',
      });
    }

    /* 3️⃣ Ensure project belongs to this client */
    const project = await ClientProject.findOne({
      _id: projectId,
      client: client._id,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ClientProject not found',
      });
    }

    /* 4️⃣ Fetch LATEST payment attempt */
    const payment = await Payment.findOne({ project: projectId })
      .sort({ createdAt: -1 }) // 🔥 CRITICAL FIX
      .lean();

    if (!payment) {
      return res.json({
        success: true,
        status: 'not_started',
        isPaid: false,
      });
    }

    return res.json({
      success: true,
      status: payment.status, // pending | confirmed | failed | cancelled | timeout
      amount: payment.amount,
      phone: payment.mpesa?.phone || null,
      initiatedAt: payment.initiatedAt,
      confirmedAt: payment.confirmedAt || null,
      failedAt: payment.failedAt || null,
    });
  } catch (err) {
    console.error('[getProjectPaymentStatus]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
