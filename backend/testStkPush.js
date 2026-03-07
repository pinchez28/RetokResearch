import { getMpesaAccessToken } from './src/services/mpesa/tokenService.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// STK Push details
const phoneNumber = '254769595400'; // Sandbox test number
const amount = 1; // Amount in KES

async function initiateStkPush() {
  try {
    const token = await getMpesaAccessToken();
    console.log('Token for STK Push:', token);

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, '')
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
    ).toString('base64');

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'TestPayment',
      TransactionDesc: 'Payment test',
    };

    const response = await axios.post(process.env.MPESA_STK_URL, stkPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('STK Push response:', response.data);
  } catch (error) {
    console.error(
      'Error initiating STK Push:',
      error.response?.data || error.message,
    );
  }
}

initiateStkPush();
