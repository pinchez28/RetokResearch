import 'dotenv/config';

import { getMpesaAccessToken } from './src/services/mpesa/tokenService.js';

(async () => {
  const token = await getMpesaAccessToken();
  console.log('Sandbox OAuth token:', token);
})();
