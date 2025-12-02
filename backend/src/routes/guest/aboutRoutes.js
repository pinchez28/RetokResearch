import express from 'express';
import {
  getAbout,
  updateAbout,
} from '../../controllers/guest/aboutController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = express.Router();

// Public — homepage loads this
router.get('/', getAbout);

// Admin — update content
router.put('/', authMiddleware, adminOnly, updateAbout);

export default router;
