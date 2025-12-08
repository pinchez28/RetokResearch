import express from 'express';
import { authMiddleware, protectClient } from '../../middleware/auth.js';
import {
  getClientProfile,
  updateClientProfile,
} from '../../controllers/client/clientProfileController.js';

const router = express.Router();

// Protect all profile routes
router.use(authMiddleware, protectClient);

// GET logged-in client profile
router.get('/', getClientProfile);

// PATCH update client profile
router.patch('/', updateClientProfile);

export default router;
