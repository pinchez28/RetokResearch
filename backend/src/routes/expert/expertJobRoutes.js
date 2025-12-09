import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import { uploadCV } from '../../middleware/uploadMiddleware.js';

// Controllers
import {
  getAvailableJobs,
  getJobDetails,
  applyForJob,
} from '../../controllers/expert/expertJobController.js';

import { getExpertAssignments } from '../../controllers/expert/expertAssignmentController.js';
import { getEarnings } from '../../controllers/expert/expertEarningsController.js';

const router = express.Router();

// -------------------------------
// 1. Expert Job Feed (all jobs available for this expert)
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
  uploadCV, // handle single CV upload
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
