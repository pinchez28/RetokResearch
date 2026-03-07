import axios from 'axios';
import { getMpesaAccessToken } from './tokenService.js';

/**
 * Initiate M-Pesa STK Push (sandbox or production)
 * @param {Object} params
 * @param {string} params.phone - Client phone (07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX)
 * @param {number} params.amount - Amount to pay
 * @param {string} params.reference - Project reference / invoice
 * @returns {Object} - STK push response details
 */
export const initiateStkPush = async ({ phone, amount, reference }) => {
  // --- 1. Input validation ---
  const validPhone = /^((2547\d{8})|(07\d{8})|(01\d{8}))$/;
  if (!validPhone.test(phone)) throw new Error('Invalid phone number');

  if (!amount || amount <= 0) throw new Error('Invalid amount');
  if (!reference) throw new Error('Missing reference');

  // --- 2. Normalize phone to 254 format ---
  if (phone.startsWith('07') || phone.startsWith('01')) {
    phone = '254' + phone.slice(1);
  }

  // --- 3. Get access token ---
  const token = await getMpesaAccessToken();
  if (!token) throw new Error('Failed to get M-Pesa access token');

  // --- 4. Build timestamp & password ---
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:\.Z]/g, '')
    .slice(0, 14);

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
  ).toString('base64');

  // --- 5. Retry mechanism ---
  let attempts = 0;
  while (attempts < 3) {
    try {
      const { data } = await axios.post(
        process.env.MPESA_STK_URL,
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phone, // Customer phone
          PartyB: process.env.MPESA_SHORTCODE, // Till / shortcode
          PhoneNumber: phone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: reference,
          TransactionDesc: 'Project Payment',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      );

      // --- 6. Basic validation of STK response ---
      if (!data || !data.CheckoutRequestID) {
        throw new Error('Invalid STK response: missing CheckoutRequestID');
      }

      // --- 7. Safe logging ---
      console.log('STK push initiated', {
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        ResponseCode: data.ResponseCode,
      });

      // --- 8. Return DB-friendly object ---
      return {
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
      };
    } catch (err) {
      attempts++;
      console.warn(`STK push attempt ${attempts} failed:`, err.message);
      if (attempts >= 3) throw new Error('STK push failed after 3 attempts');
    }
  }
};
