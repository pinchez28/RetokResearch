import ClientProject from '../../models/client/ClientProject.js';
import ExpertAssignment from '../../models/expert/ExpertAssignment.js';
import Payment from '../../models/payments/Payment.js';
import AuditLog from '../../models/admin/AuditLog.js';
import Notification from '../../models/notification/Notification.js';
import { sendEmail } from '../../services/emailService.js';
import path from 'path';

/**
 * GET /admin/projects
 * List all projects with client, expert, job info, payment summary, status
 */
export const listProjects = async (req, res) => {
  try {
    const projects = await ClientProject.find()
      .populate('client', 'name email')
      .populate('expert', 'name email')
      .populate('job', 'title agreedAmount')
      .sort({ createdAt: -1 });

    const projectsWithPayment = await Promise.all(
      projects.map(async (p) => {
        const payment = await Payment.findOne({ project: p._id });
        const totalPaid = payment?.amount || 0;
        const totalAmount = p.finalCost || 0; // <-- client total payable
        const platformFee = Math.round(totalPaid * 0.15);
        const expertPayable = totalPaid - platformFee;

        return {
          ...p.toObject(),
          paymentSummary: {
            totalAmount,
            totalPaid,
            platformFee,
            expertPayable,
            status: payment?.status || 'unpaid',
          },
        };
      }),
    );

    res.json({ success: true, projects: projectsWithPayment });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch projects' });
  }
};

/**
 * GET /admin/projects/:projectId
 * Get full project details
 */
export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ClientProject.findById(projectId)
      .populate('client', 'name email')
      .populate('expert', 'name email')
      .populate('job', 'title agreedAmount');

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }

    const assignments = await ExpertAssignment.find({
      project: projectId,
    }).populate('expert', 'name email');

    const payment = await Payment.findOne({ project: projectId });

    const totalPaid = payment?.amount || 0;
    const totalAmount = project.finalCost || 0; // <-- client total payable
    const platformFee = Math.round(totalPaid * 0.15);
    const expertPayable = totalPaid - platformFee;

    res.json({
      success: true,
      project,
      assignments,
      payment: {
        totalAmount,
        totalPaid,
        platformFee,
        expertPayable,
        status: payment?.status || 'unpaid',
        paidAt: payment?.paidAt || null,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch project details' });
  }
};

export const getProjectByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const project = await ClientProject.findOne({ job: jobId })
      .populate('client', 'name email')
      .populate('expert', 'name email')
      .populate('job', 'title')
      .lean(); // ✅ IMPORTANT

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found for this job',
      });
    }

    res.json({
      success: true,
      project: {
        ...project,

        // 🔥 EXPLICIT FLAGS FOR FRONTEND
        manualPaymentRequested: project.manualPaymentRequested || false,
        adminUnlocked: project.adminUnlocked || false,
        isPaid: project.isPaid || false,
        paymentConfirmed: project.paymentConfirmed || false,
      },
    });
  } catch (err) {
    console.error('[getProjectByJobId]', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/*
POST /admin/projects/:id/unlock
*/
export const confirmManualPayment = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ClientProject.findById(projectId)
      .populate({
        path: 'client',
        populate: { path: 'user', select: '_id email name' },
      })
      .populate('job', 'title canClientDownload');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    /* ======================================
       PREVENT DOUBLE CONFIRMATION
    ====================================== */
    if (project.adminUnlocked) {
      return res.status(400).json({
        success: false,
        message: 'Payment already confirmed',
      });
    }

    /* ======================================
       UNLOCK PROJECT & ALLOW CLIENT DOWNLOAD
    ====================================== */
    project.adminUnlocked = true;
    project.paymentConfirmed = true;
    project.isPaid = true;
    project.paidAt = new Date();

    await project.save();

    // ✅ Mark job as downloadable for client
    if (project.job) {
      project.job.paymentConfirmed = true;
      await project.job.save();
    }

    /* ======================================
       CLIENT IN-APP NOTIFICATION
    ====================================== */
    if (project.client?.user?._id) {
      await Notification.create({
        userType: 'Client',
        userId: project.client.user._id,
        title: 'Payment Confirmed',
        message: `Payment confirmed for "${project.job?.title}". You can now download your project.`,
        jobId: project.job?._id || null,
      });
    }

    /* ======================================
       ADMIN NOTIFICATION
    ====================================== */
    await Notification.create({
      userType: 'Admin',
      title: 'Payment Verified',
      message: `Admin confirmed payment for project "${project.job?.title}".`,
      jobId: project.job?._id || null,
    });

    /* ======================================
       EMAIL CLIENT
    ====================================== */
    // if (project.client?.user?.email) {
    //   await sendEmail({
    //     to: project.client.user.email,
    //     subject: 'Payment Confirmed - Project Download Available',
    //     html: `
    //       <h2>Payment Confirmed</h2>
    //       <p>Your payment for the project below has been confirmed:</p>
    //       <b>${project.job?.title}</b>
    //       <p>You can now login to your dashboard and download your completed work.</p>
    //       <p>Thank you for using our platform.</p>
    //     `,
    //   });
    // }

    return res.json({
      success: true,
      message: 'Payment confirmed, project unlocked, client can download',
      projectId: project._id,
      unlocked: true,
      project: {
        adminUnlocked: true,
        isPaid: true,
        paymentConfirmed: true,
        canClientDownload: project.job?.canClientDownload || false,
      },
    });
  } catch (err) {
    console.error('[confirmManualPayment]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * GET /admin/projects/:projectId/submission
 * Download final submitted work
 */
export const downloadSubmission = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ClientProject.findById(projectId).populate(
      'client expert',
      'name email',
    );

    if (!project || !project.finalWorkUrl) {
      return res
        .status(404)
        .json({ success: false, message: 'Submission not found' });
    }

    const filePath = path.resolve(project.finalWorkUrl);
    const fileName = project.originalFilename || 'submission.zip';

    // Log admin download for auditing
    await AuditLog.create({
      admin: req.user._id,
      action: 'DOWNLOAD_SUBMISSION',
      project: projectId,
      timestamp: new Date(),
    });

    res.download(filePath, fileName);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to download submission' });
  }
};

/**
 * POST /admin/projects/:projectId/payout
 * Admin triggers expert payout
 */
export const payoutProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ClientProject.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const payment = await Payment.findOne({ project: projectId });
    if (!payment || payment.status !== 'paid') {
      return res.status(400).json({ message: 'Client has not paid yet' });
    }

    const totalPaid = payment.amount;
    const platformFee = Math.round(totalPaid * 0.15);
    const expertPayable = totalPaid - platformFee;

    // TODO: integrate payment service to send expertPayable to expert
    // await paymentService.sendToExpert(project.expert, expertPayable);

    project.status = 'completed';
    await project.save();

    res.json({
      success: true,
      message: 'Payout processed',
      payout: { expertPayable, platformFee },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process payout' });
  }
};

/**
 * POST /admin/projects/:projectId/refund
 * Admin triggers refund to client
 */
export const refundProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reason, note } = req.body;

    const project = await ClientProject.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const payment = await Payment.findOne({ project: projectId });
    if (!payment || payment.status !== 'paid') {
      return res.status(400).json({ message: 'Client has not paid yet' });
    }

    // TODO: integrate payment gateway refund logic here
    // await paymentService.refund(payment.transactionId);

    project.status = 'refunded';
    await project.save();

    // Log refund
    await AuditLog.create({
      admin: req.user._id,
      action: 'REFUND_PROJECT',
      project: projectId,
      note: `${reason || ''} - ${note || ''}`,
      timestamp: new Date(),
    });

    res.json({ success: true, message: 'Refund processed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process refund' });
  }
};
