import express from 'express';
import {
  getAbout,
  updateAbout,
} from '../../controllers/guest/guestAboutController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// Public — homepage loads this
router.get('/', getAbout);

// Admin — update content
router.put('/', authMiddleware, adminOnly, updateAbout);

export default router;
