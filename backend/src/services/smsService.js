// backend/src/services/smsService.js
import AfricasTalking from 'africastalking';

const africasTalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africasTalking.SMS; // ✅ no parentheses

/**
 * Send an SMS
 * @param {string} phone - Recipient phone (format 2547XXXXXXXX)
 * @param {string} message - SMS body
 */
export async function sendSMS(phone, message) {
  if (!/^254\d{9}$/.test(phone)) {
    throw new Error('Invalid phone number for SMS');
  }

  if (!message) throw new Error('SMS message is required');

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('SMS stub (dev mode):', phone, message);
      return { status: 'stubbed' };
    }

    const response = await sms.send({
      to: phone,
      message,
      from: 'Academin', // optional sender ID
    });

    console.log('SMS sent:', response);
    return response;
  } catch (err) {
    console.error('SMS sending failed:', err.message);
    throw err;
  }
}
