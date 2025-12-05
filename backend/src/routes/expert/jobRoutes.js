import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';

import {
  getAvailableJobs,
  getJobDetails,
  applyForJob,
} from '../../controllers/expert/jobController.js';
import { getExpertAssignments } from '../../controllers/expert/assignmentController.js';
import { getEarnings } from '../../controllers/expert/earningsController.js';

import { uploadCV } from '../../middleware/multer.js';

const router = express.Router();

// Job feed
router.get('/jobs', authMiddleware, authorizeRoles('expert'), getAvailableJobs);

// Single job
router.get(
  '/jobs/:jobId',
  authMiddleware,
  authorizeRoles('expert'),
  getJobDetails
);

// Apply for job (proposal + optional CV)
router.post(
  '/jobs/:jobId/apply',
  authMiddleware,
  authorizeRoles('expert'),
  uploadCV,
  applyForJob
);

// Assignments
router.get(
  '/assignments',
  authMiddleware,
  authorizeRoles('expert'),
  getExpertAssignments
);

// Earnings
router.get('/earnings', authMiddleware, authorizeRoles('expert'), getEarnings);

export default router;
