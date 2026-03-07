// backend/src/services/notificationService.js
import Notification from '../models/notification/Notification.js';

/**
 * General notification function
 */
export async function notify({
  userId = null,
  userType = 'Global',
  title,
  message,
  type = 'General',
  jobId = null,
  io = null,
  email = false,
  sms = false,
}) {
  if (!title || !message)
    throw new Error('Notification title and message are required');

  const notification = await Notification.create({
    userId,
    userType,
    title,
    message,
    type,
    jobId,
  });

  if (io) io.emit('notification:new', { notification });
  if (email) {
    /* sendEmail(userId, title, message) */
  }
  if (sms) {
    /* sendSMS(userId, message) */
  }
  return notification;
}

/**
 * Send payment receipt via email/SMS
 */
export async function sendPaymentReceipt(payment) {
  // Here you can implement actual email/SMS logic later
  const message = `Payment of ${payment.amount} for project ${payment.project} confirmed. Receipt: ${payment.mpesa.receiptNumber}`;

  // Optional: store a notification record too
  await notify({
    userId: payment.client, // assuming Payment has a client field
    userType: 'Client',
    title: 'Payment Received',
    message,
    email: true,
    sms: true,
  });

  console.log('Payment receipt sent for payment:', payment._id);
}
