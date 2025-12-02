import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';
import {
  getPendingJobs,
  rejectJob,
  reviewJob,
  getActiveJobs,
} from '../../controllers/admin/jobController.js';

const router = express.Router();

// GET pending jobs
router.get('/pending', authMiddleware, authorizeRoles('Admin'), getPendingJobs);

// GET active jobs
router.get('/active', authMiddleware, authorizeRoles('Admin'), getActiveJobs);

// PATCH reject job
router.patch(
  '/reject/:jobId',
  authMiddleware,
  authorizeRoles('Admin'),
  rejectJob
);

// PUT review job
router.put(
  '/:jobId/review',
  authMiddleware,
  authorizeRoles('Admin'),
  reviewJob
);

export default router;
