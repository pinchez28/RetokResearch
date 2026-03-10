import dotenv from 'dotenv';
dotenv.config(); // <-- load .env variables

import AfricasTalking from 'africastalking';

const africasTalkingUsername = process.env.AFRICASTALKING_USERNAME || 'sandbox';
const africasTalkingApiKey = process.env.AFRICASTALKING_API_KEY || 'dev_key';

const africasTalking = AfricasTalking({
  username: africasTalkingUsername,
  apiKey: africasTalkingApiKey,
});

const sms = africasTalking.SMS;

export async function sendSMS(phone, message) {
  if (!/^254\d{9}$/.test(phone)) throw new Error('Invalid phone number');
  if (!message) throw new Error('SMS message is required');

  if (process.env.NODE_ENV === 'development') {
    console.log('SMS stub (dev mode):', phone, message);
    return { status: 'stubbed' };
  }

  try {
    const response = await sms.send({ to: phone, message, from: 'Academin' });
    console.log('SMS sent:', response);
    return response;
  } catch (err) {
    console.error('SMS sending failed:', err.message);
    throw err;
  }
}
