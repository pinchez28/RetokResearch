import Payment from '../../models/payments/Payment.js';
import ClientProject from '../../models/client/ClientProject.js';
import Job from '../../models/client/Job.js';
import { emitProjectPaid } from '../../sockets/index.js';
import { sendPaymentReceipt } from '../../services/notificationService.js';
import { initiateStkPush } from '../../services/mpesa/stkService.js';

/**
 * Handles STK push callback from Safaricom
 */
export const stkCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.json({ ResultCode: 0 });

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

    const payment = await Payment.findOne({
      'mpesa.checkoutRequestId': CheckoutRequestID,
    });
    if (!payment) return res.json({ ResultCode: 0 });
    if (payment.status === 'confirmed') return res.json({ ResultCode: 0 });

    payment.mpesa.resultCode = ResultCode;
    payment.mpesa.callbackMetadata = CallbackMetadata;

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
      const paidAmount = Number(
        items.find((i) => i.Name === 'Amount')?.Value || 0,
      );

      if (paidAmount !== Number(payment.amount)) {
        payment.status = 'failed';
        payment.failedAt = new Date();
        payment.mpesa.resultDesc = 'Amount mismatch';
        await payment.save();
        return res.json({ ResultCode: 0 });
      }

      // --- Payment confirmed ---
      payment.status = 'confirmed';
      payment.confirmedAt = new Date();
      payment.mpesa.receiptNumber = receipt;
      await payment.save();

      // --- Update project & job ---
      const project = await ClientProject.findById(payment.project);
      if (project) {
        project.isPaid = true;
        project.paymentConfirmed = true;
        project.paidAt = new Date();
        await project.save();

        if (project.job) {
          await Job.findByIdAndUpdate(project.job, {
            isPaid: true,
            paymentConfirmed: true,
            paidAt: new Date(),
          });
        } else {
          const job = await Job.create({
            client: project.client,
            clientProject: project._id,
            status: 'ready',
            isPaid: true,
            paymentConfirmed: true,
            paidAt: new Date(),
            finalWorkUrl: project.finalWorkUrl,
          });
          project.job = job._id;
          await project.save();
        }

        // --- 🔥 Emit event to frontend ---
        emitProjectPaid(payment.project.toString());

        sendPaymentReceipt(payment).catch((err) =>
          console.error('Failed to send receipt:', err),
        );
      }
    } else {
      payment.status = ResultCode === 1032 ? 'cancelled' : 'failed';
      payment.failedAt = new Date();
      await payment.save();
    }

    return res.json({ ResultCode: 0 });
  } catch (err) {
    console.error('STK callback error:', err);
    return res.json({ ResultCode: 0 });
  }
};

/**
 * Initiate M-Pesa payment for a project
 */
export const initiateProjectPayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    let { phone } = req.body;
    const clientProfileId = req.user.profile._id;

    // Validate phone
    phone = phone?.trim();
    if (!/^((2547\d{8})|(07\d{8})|(01\d{8}))$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid M-Pesa phone number' });
    }
    if (phone.startsWith('07') || phone.startsWith('01'))
      phone = '254' + phone.slice(1);

    // Fetch project
    const project = await ClientProject.findOne({
      _id: projectId,
      client: clientProfileId,
    });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    if (project.isPaid)
      return res
        .status(409)
        .json({ success: false, message: 'Project already paid' });
    if (project.finalCost == null || Number(project.finalCost) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project final cost' });
    }

    const amountToPay = Number(project.finalCost);

    // Expire old pending payments
    await Payment.updateMany(
      {
        project: projectId,
        status: 'pending',
        createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
      },
      {
        status: 'timeout',
        failedAt: new Date(),
        'mpesa.resultDesc': 'Payment timeout',
      },
    );

    // Check for existing pending payment
    const existingPending = await Payment.findOne({
      project: projectId,
      status: 'pending',
    });
    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: 'A payment is already in progress for this project',
        paymentId: existingPending._id,
        checkoutRequestId: existingPending.mpesa?.checkoutRequestId,
        createdAt: existingPending.createdAt,
      });
    }

    // CREATE NEW PAYMENT (wrap in try/catch for race condition)
    let payment;
    try {
      payment = await Payment.create({
        client: clientProfileId,
        project: projectId,
        amount: amountToPay,
        mpesa: { phone },
        status: 'pending',
        type: 'PROJECT_PAYMENT',
      });
    } catch (err) {
      if (err.code === 11000) {
        // duplicate key error
        const duplicatePayment = await Payment.findOne({
          project: projectId,
          status: 'pending',
        });
        return res.status(409).json({
          success: false,
          message: 'A payment is already in progress for this project',
          paymentId: duplicatePayment._id,
          checkoutRequestId: duplicatePayment.mpesa?.checkoutRequestId,
        });
      }
      throw err;
    }

    // Initiate STK push
    let stkResponse;
    try {
      stkResponse = await initiateStkPush({
        phone,
        amount: amountToPay,
        reference: `Project-${projectId}`,
      });
    } catch (stkError) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.mpesa.resultDesc = stkError.message || 'STK push failed';
      await payment.save();
      return res.status(500).json({
        success: false,
        message: 'Failed to initiate STK push',
        error: stkError.message,
      });
    }

    // Save STK IDs
    payment.mpesa.merchantRequestId = stkResponse.merchantRequestId;
    payment.mpesa.checkoutRequestId = stkResponse.checkoutRequestId;
    await payment.save();

    return res.json({
      success: true,
      message: 'STK push sent to phone',
      paymentId: payment._id,
      checkoutRequestId: stkResponse.checkoutRequestId,
      amount: amountToPay,
    });
  } catch (err) {
    console.error('❌ [initiateProjectPayment ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: err.message,
    });
  }
};

/**
 * Manual payment recording (for Paybill/Till)
 * Only for admin use when M-Pesa isn't possible
 */
export const manualPayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { transactionId, amount } = req.body;
    const clientId = req.user.profile._id;

    // Fetch project
    const project = await ClientProject.findOne({
      _id: projectId,
      client: clientId,
    });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    if (project.isPaid)
      return res
        .status(409)
        .json({ success: false, message: 'Project already paid' });

    const finalAmount = amount ? Number(amount) : Number(project.finalCost);

    // Create payment
    const payment = await Payment.create({
      client: clientId,
      project: projectId,
      amount: finalAmount,
      method: 'PAYBILL',
      status: 'confirmed',
      mpesa: {
        phone: null,
        receiptNumber: transactionId,
        resultDesc: 'Manual payment via Paybill/Till',
      },
      confirmedAt: new Date(),
    });

    // Update ClientProject
    project.isPaid = true;
    project.paymentConfirmed = true;
    project.paidAt = new Date();
    await project.save();

    // Update or create Job
    if (project.job) {
      await Job.findByIdAndUpdate(project.job, {
        isPaid: true,
        paymentConfirmed: true,
        paidAt: new Date(),
      });
    } else {
      const job = await Job.create({
        client: project.client,
        clientProject: project._id,
        status: 'ready',
        isPaid: true,
        paymentConfirmed: true,
        paidAt: new Date(),
        finalWorkUrl: project.finalWorkUrl,
      });
      project.job = job._id;
      await project.save();
    }

    emitProjectPaid(projectId.toString());
    sendPaymentReceipt(payment).catch(console.error);

    return res.json({
      success: true,
      message: 'Manual payment recorded',
      payment,
    });
  } catch (err) {
    console.error('[manualPayment] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to record manual payment',
      error: err.message,
    });
  }
};

/**
 * Check payment status endpoint
 * Useful for frontend to poll when retrying
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const clientProfileId = req.user.profile._id;

    // Get the latest payment for this project & client
    const payment = await Payment.findOne({
      project: projectId,
      client: clientProfileId,
    }).sort({ createdAt: -1 });

    // If no payment exists, return "none"
    if (!payment) {
      return res.json({
        success: true,
        payment: {
          status: 'none',
        },
      });
    }

    // Map internal payment statuses to UI-friendly statuses
    let uiStatus;
    switch (payment.status) {
      case 'confirmed':
        uiStatus = 'confirmed'; // download allowed
        break;
      case 'pending':
        uiStatus = 'pending'; // waiting for STK push completion
        break;
      case 'failed':
      case 'cancelled':
      case 'timeout':
        uiStatus = 'failed'; // show retry option
        break;
      default:
        uiStatus = 'unknown';
    }

    return res.json({
      success: true,
      payment: {
        id: payment._id,
        status: uiStatus,
        amount: payment.amount,
        createdAt: payment.createdAt,
        confirmedAt: payment.confirmedAt || null,
        failedAt: payment.failedAt || null,
        mpesaReceipt: payment.mpesa?.receiptNumber || null,
        resultDesc: payment.mpesa?.resultDesc || null,
      },
    });
  } catch (err) {
    console.error('[checkPaymentStatus] error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: err.message,
    });
  }
};
/**
 * Retry failed payment
 * New endpoint specifically for retrying failed payments
 */
export const retryFailedPayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    let { phone } = req.body;
    const clientProfileId = req.user.profile._id;

    // ---------------- Phone validation & normalization ----------------
    phone = phone?.trim();
    const validPhone = /^((2547\d{8})|(07\d{8})|(01\d{8}))$/;
    if (!validPhone.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid M-Pesa phone number',
      });
    }
    if (phone.startsWith('07') || phone.startsWith('01'))
      phone = '254' + phone.slice(1);

    // ---------------- Fetch project ----------------
    const project = await ClientProject.findOne({
      _id: projectId,
      client: clientProfileId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found' });
    }
    if (project.isPaid) {
      return res
        .status(409)
        .json({ success: false, message: 'Project already paid' });
    }

    // ---------------- Check existing pending payment ----------------
    const existingPending = await Payment.findOne({
      project: projectId,
      status: 'pending',
    });
    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: 'A payment is already in progress',
        paymentId: existingPending._id,
        checkoutRequestId: existingPending.mpesa?.checkoutRequestId,
        createdAt: existingPending.createdAt,
      });
    }

    // ---------------- Create new payment ----------------
    const amountToPay = Number(project.finalCost);
    if (Number.isNaN(amountToPay) || amountToPay <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid project payment amount' });
    }

    const payment = await Payment.create({
      client: clientProfileId,
      project: projectId,
      amount: amountToPay,
      mpesa: { phone },
      status: 'pending',
    });

    // ---------------- Initiate STK push ----------------
    let stkResponse;
    try {
      stkResponse = await initiateStkPush({
        phone,
        amount: amountToPay,
        reference: `Project-${projectId}-retry-${Date.now()}`,
      });
    } catch (stkError) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.mpesa.resultDesc = stkError.message || 'STK push failed';
      await payment.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to initiate STK push. Please try again.',
        error: stkError.message,
      });
    }

    payment.mpesa.merchantRequestId = stkResponse.merchantRequestId;
    payment.mpesa.checkoutRequestId = stkResponse.checkoutRequestId;
    await payment.save();

    // ---------------- Emit real-time update if payment confirmed ----------------
    // This will be triggered later in your STK callback when Safaricom confirms payment
    // emitProjectPaid(projectId); // <-- already handled in stkCallback

    return res.json({
      success: true,
      message: 'STK push sent to phone',
      paymentId: payment._id,
      checkoutRequestId: stkResponse.checkoutRequestId,
      amount: amountToPay,
    });
  } catch (err) {
    console.error('❌ [retryFailedPayment ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Payment retry failed',
      error: err.message,
    });
  }
};
