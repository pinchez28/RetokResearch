import GuestRequest from '../../models/guest/GuestRequest.js';
import Expert from '../../models/expert/Expert.js';
import sendEmail from '../../../utils/sendEmail.js';
import Notification from '../../models/notification/Notification.js';

const notifyGuest = async (request, subject, html) => {
  try {
    if (!request?.guest?.email) return;

    await sendEmail({
      to: request.guest.email,
      subject,
      html,
    });
  } catch (err) {
    console.error('Guest email failed:', err.message);
  }
};

/* ============================================================
   STATUS TRANSITION GUARD (STRICT STATE MACHINE)
============================================================ */
const allowedTransitions = {
  new: ['acknowledged', 'cancelled'],
  acknowledged: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['submitted', 'cancelled'],
  submitted: ['ready_for_delivery', 'cancelled'],
  ready_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// GET /admin/experts
export const getAllExperts = async (req, res) => {
  const experts = await Expert.find();
  res.json({ success: true, experts });
};

const validateTransition = (current, next) => {
  if (!allowedTransitions[current]?.includes(next)) {
    throw new Error(`Invalid status transition from ${current} to ${next}`);
  }
};

/* ============================================================
   1️⃣ GET ALL REQUESTS
============================================================ */
export const adminGetGuestRequests = async (req, res) => {
  try {
    const requests = await GuestRequest.find()
      .populate('assignedExpert', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, total: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   2️⃣ GET SINGLE REQUEST
============================================================ */
export const adminGetGuestRequestById = async (req, res) => {
  try {
    const request = await GuestRequest.findById(req.params.id).populate(
      'assignedExpert',
      'name email',
    );

    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   3️⃣ ACKNOWLEDGE REQUEST
============================================================ */
export const adminAcknowledgeRequest = async (req, res) => {
  try {
    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'acknowledged');

    request.status = 'acknowledged';
    request.progress = 10;

    request.timeline.push({
      actor: 'admin',
      message: 'Request acknowledged',
    });

    await request.save({ validateBeforeSave: false });

    // Email guest
    notifyGuest(
      request,
      'Your Request Has Been Received',
      `
      <p>Hello ${request.guest.name || 'Guest'},</p>
      <p>Your request has been received and is currently under review.</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ============================================================
   4️⃣ UPDATE  THE GUET REQUEST
============================================================ */
export const adminUpdateGuestRequest = async (req, res) => {
  try {
    const { serviceType, price } = req.body;

    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    request.serviceType = serviceType;
    request.price = price;
    request.payment.requiredAmount = price;

    request.status = 'full_request';
    request.progress = 25;

    request.timeline.push({
      actor: 'admin',
      message: `Service set to ${serviceType}, price updated to ${price}`,
    });

    await request.save({ validateBeforeSave: false });

    notifyGuest(
      request,
      'Your Request Has Been Reviewed',
      `
      <p>Hello ${request.guest.name},</p>
      <p>Your request has been reviewed.</p>
      <p><strong>Service:</strong> ${serviceType}</p>
      <p><strong>Price:</strong> ${price} ${request.currency}</p>
      <p>Please proceed with payment to continue.</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin Assign Expert

export const adminAssignExpert = async (req, res) => {
  try {
    const { expertId } = req.body;

    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'assigned');

    request.assignedExpert = expertId;
    request.status = 'assigned';
    request.progress = 40;

    request.timeline.push({
      actor: 'admin',
      message: 'Expert assigned to request',
    });

    await request.save({ validateBeforeSave: false });

    notifyGuest(
      request,
      'Your Project Has Been Assigned',
      `
      <p>Hello ${request.guest.name},</p>
      <p>Your project has been assigned to an expert and work will begin shortly.</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ============================================================
   5️⃣ APPROVE SUBMISSION
============================================================ */
export const adminApproveSubmission = async (req, res) => {
  try {
    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'ready_for_delivery');

    request.status = 'ready_for_delivery';
    request.progress = 90;

    request.timeline.push({
      actor: 'admin',
      message: 'Submission approved',
    });

    await request.save();

    await sendEmail({
      to: request.guest.email,
      subject: 'Your project is ready',
      html: `<p>Hello ${request.guest.name},</p>
             <p>Your project is ready. Kindly complete payment to receive it.</p>`,
    });

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mark Ready for Delivery
export const adminMarkReadyForDelivery = async (req, res) => {
  try {
    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'ready_for_delivery');

    request.status = 'ready_for_delivery';
    request.progress = 90;

    request.timeline.push({
      actor: 'admin',
      message: 'Work approved and ready for delivery',
    });

    await request.save({ validateBeforeSave: false });

    notifyGuest(
      request,
      'Your Work Is Ready',
      `
      <p>Hello ${request.guest.name},</p>
      <p>Your work has been completed and approved.</p>
      <p>You can now download your files from your dashboard.</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ============================================================
   6️⃣ CONFIRM PAYMENT & DELIVER
============================================================ */
export const adminConfirmPaymentAndDeliver = async (req, res) => {
  try {
    const { transactionReference } = req.body;

    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'completed');

    if (!request.files?.expertSubmission?.url) {
      return res.status(400).json({
        success: false,
        message: 'No expert submission found',
      });
    }

    request.payment.paid = true;
    request.payment.paidAt = new Date();
    request.payment.transactionReference = transactionReference;

    request.files.finalDelivery = {
      ...request.files.expertSubmission,
      deliveredAt: new Date(),
    };

    request.status = 'completed';
    request.progress = 100;

    request.timeline.push({
      actor: 'admin',
      message: 'Payment confirmed and project delivered',
    });

    await request.save();

    await sendEmail({
      to: request.guest.email,
      subject: 'Your Project is Completed',
      html: `<p>Hello ${request.guest.name},</p>
             <p>Your payment has been confirmed.</p>
             <p>Download your project below:</p>
             <a href="${request.files.finalDelivery.url}">Download</a>`,
    });

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Complete Request
export const adminCompleteRequest = async (req, res) => {
  try {
    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'completed');

    request.status = 'completed';
    request.progress = 100;

    request.timeline.push({
      actor: 'admin',
      message: 'Work delivered to guest',
    });

    await request.save({ validateBeforeSave: false });

    notifyGuest(
      request,
      'Project Successfully Delivered',
      `
      <p>Hello ${request.guest.name},</p>
      <p>Your project has been successfully delivered.</p>
      <p>Thank you for working with us.</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel Request
export const adminCancelRequest = async (req, res) => {
  try {
    const { reason } = req.body;

    const request = await GuestRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    validateTransition(request.status, 'cancelled');

    request.status = 'cancelled';
    request.progress = 0;

    request.timeline.push({
      actor: 'admin',
      message: `Request cancelled. Reason: ${reason || 'Not specified'}`,
    });

    await request.save({ validateBeforeSave: false });

    notifyGuest(
      request,
      'Your Request Has Been Cancelled',
      `
      <p>Hello ${request.guest.name},</p>
      <p>Your request has been cancelled.</p>
      <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
      `,
    );

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ============================================================
   7️⃣ DELETE REQUEST
============================================================ */
export const adminDeleteGuestRequest = async (req, res) => {
  try {
    const request = await GuestRequest.findByIdAndDelete(req.params.id);

    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
