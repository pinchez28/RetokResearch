import express from 'express';
import { reviewJob } from '../../controllers/admin/jobController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';

const router = express.Router();

/**
 * @route   PUT /api/admin/jobs/:jobId/review
 * @desc    Admin reviews a job, sets pricing, selects experts
 * @access  Private (admin only)
 */
router.put(
  '/:jobId/review',
  authMiddleware,
  authorizeRoles('admin'),
  reviewJob
);

export default router;
