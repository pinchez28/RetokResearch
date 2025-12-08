import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';
import { uploadCV } from '../../middleware/multer.js';

import {
  getAvailableJobs,
  getJobDetails,
  applyForJob,
} from '../../controllers/expert/jobController.js';

import { getExpertAssignments } from '../../controllers/expert/assignmentController.js';
import { getEarnings } from '../../controllers/expert/earningsController.js';

const router = express.Router();

// -------------------------------
// 1. Expert Job Feed
// -------------------------------
router.get('/jobs', authMiddleware, authorizeRoles('expert'), getAvailableJobs);

// -------------------------------
// 2. Single Job Details
// -------------------------------
router.get(
  '/jobs/:jobId',
  authMiddleware,
  authorizeRoles('expert'),
  getJobDetails
);

// -------------------------------
// 3. Apply for a Job (proposal + optional CV)
// -------------------------------
router.post(
  '/jobs/:jobId/apply',
  authMiddleware,
  authorizeRoles('expert'),
  uploadCV,
  applyForJob
);

// -------------------------------
// 4. Expert Assignments
// -------------------------------
router.get(
  '/assignments',
  authMiddleware,
  authorizeRoles('expert'),
  getExpertAssignments
);

// -------------------------------
// 5. Expert Earnings
// -------------------------------
router.get('/earnings', authMiddleware, authorizeRoles('expert'), getEarnings);

export default router;
