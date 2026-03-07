import axios from 'axios';

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get M-Pesa access token
 * Uses Basic Auth with consumerKey:consumerSecret
 * Caches token until expiry to avoid unnecessary requests
 * Works for sandbox or production depending on env
 */
export const getMpesaAccessToken = async () => {
  try {
    // --- 1. Check if cached token is still valid ---
    const now = new Date();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
      return cachedToken;
    }

    // --- 2. Prepare credentials ---
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('M-Pesa credentials missing in environment variables');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      'base64',
    );

    // --- 3. Determine environment URL ---
    const url =
      process.env.MPESA_ENV === 'production'
        ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    // --- 4. Request access token ---
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      timeout: 5000,
    });

    if (!response.data?.access_token) {
      throw new Error('Invalid response from M-Pesa token API');
    }

    // --- 5. Cache token ---
    cachedToken = response.data.access_token;
    tokenExpiry = new Date(
      now.getTime() + (response.data.expires_in - 60) * 1000,
    ); // renew 1 min early

    console.log('M-Pesa access token retrieved');

    return cachedToken;
  } catch (err) {
    console.error('Failed to get M-Pesa access token:', err.message);
    throw err;
  }
};
