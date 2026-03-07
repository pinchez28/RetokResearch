import express from 'express';
import {
  listProjects,
  getProjectDetails,
  downloadSubmission,
  payoutProject,
  refundProject,
} from '../../controllers/admin/adminProjectController.js';

import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// Apply authentication + admin role check for all admin project routes
router.use(authMiddleware, adminOnly);

/**
 * GET /api/admin/projects
 * List all projects with client, expert, job info, payment summary, status
 */
router.get('/', listProjects);

/**
 * GET /api/admin/projects/:projectId
 * Get full project details, assignments, payment info
 */
router.get('/:projectId', getProjectDetails);

/**
 * GET /api/admin/projects/:projectId/submission
 * Download final submitted work (read-only, logged)
 */
router.get('/:projectId/submission', downloadSubmission);

/**
 * POST /api/admin/projects/:projectId/payout
 * Trigger expert payout (optional, post-payment)
 */
router.post('/:projectId/payout', payoutProject);

/**
 * POST /api/admin/projects/:projectId/refund
 * Trigger refund to client (optional, post-payment)
 */
router.post('/:projectId/refund', refundProject);

export default router;
