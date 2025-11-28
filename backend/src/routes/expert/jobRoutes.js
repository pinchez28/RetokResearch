import express from 'express';
import {
  getAvailableJobs,
  applyForJob,
} from '../../controllers/expert/jobController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';

const router = express.Router();

/**
 * @route   GET /api/expert/jobs
 * @desc    Get all jobs assigned to the expert
 * @access  Private (expert only)
 */
router.get('/', authMiddleware, authorizeRoles('expert'), getAvailableJobs);

/**
 * @route   POST /api/expert/jobs/:jobId/apply
 * @desc    Expert applies for a job
 * @access  Private (expert only)
 */
router.post(
  '/:jobId/apply',
  authMiddleware,
  authorizeRoles('expert'),
  applyForJob
);

export default router;
