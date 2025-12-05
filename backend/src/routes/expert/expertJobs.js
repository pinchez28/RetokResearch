import express from 'express';
import {
  getAvailableJobs,
  applyForJob,
} from '../../controllers/expert/jobController.js';
import { protect, expertOnly } from '../middleware/auth.js';
import { uploadJobFiles } from '../../middleware/multer.js'; // <-- import multer

const router = express.Router();

// Get all jobs available for this expert
router.get('/jobs', protect, expertOnly, getAvailableJobs);

// Apply for a job (with optional CV upload)
router.post(
  '/jobs/:jobId/apply',
  protect,
  expertOnly,
  uploadJobFiles.single('cv'), // <-- attach multer here
  applyForJob
);

export default router;
