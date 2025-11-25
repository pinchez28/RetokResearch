import express from 'express';
import {
  createGuestSubmission,
  getAllGuestSubmissions,
} from '../controllers/guestSubmissionController.js';
import { protect, isAdmin } from '../middleware/auth.js'; // use your existing auth

const router = express.Router();

// Anyone (guest) can create a submission
router.post('/', createGuestSubmission);

// Only admin can view all submissions
router.get('/', protect, isAdmin, getAllGuestSubmissions);

export default router;
