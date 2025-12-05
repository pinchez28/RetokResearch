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

// GET /api/admin/jobs/pending - fetch all pending jobs
router.get('/pending', authMiddleware, authorizeRoles('Admin'), getPendingJobs);

// GET /api/admin/jobs/active - fetch all active jobs
router.get('/active', authMiddleware, authorizeRoles('Admin'), getActiveJobs);

// PUT /api/admin/jobs/reject/:jobId - reject a job
router.put(
  '/reject/:jobId',
  authMiddleware,
  authorizeRoles('Admin'),
  rejectJob
);

// PUT /api/admin/jobs/:jobId/review - approve/review a job
router.put(
  '/:jobId/review',
  authMiddleware,
  authorizeRoles('Admin'),
  reviewJob
);

export default router;
