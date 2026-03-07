import express from 'express';
import { stkCallback } from '../../controllers/mpesa/mpesaCallbackController.js';

const router = express.Router();

// Endpoint Safaricom calls
router.post('/callback', stkCallback);

export default router;
