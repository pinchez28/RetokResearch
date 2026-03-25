import express from 'express';
import {
  listProjects,
  getProjectDetails,
  getProjectByJobId,
  downloadSubmission,
  payoutProject,
  refundProject,
  confirmManualPayment,
} from '../../controllers/admin/adminProjectController.js';

import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

const router = express.Router();

/* =========================================================
   🔐 GLOBAL MIDDLEWARE (AUTH + ADMIN ONLY)
========================================================= */
router.use(authMiddleware, adminOnly);

/* =========================================================
   📊 LIST ALL PROJECTS
   GET /api/admin/projects
========================================================= */
router.get('/', listProjects);

/* =========================================================
   🔎 GET PROJECT BY JOB ID (FIXED ROUTE)
   GET /api/admin/projects/by-job/:jobId
========================================================= */
router.get('/by-job/:jobId', getProjectByJobId);

/* =========================================================
   📄 GET FULL PROJECT DETAILS
   GET /api/admin/projects/:projectId
========================================================= */
router.get('/:projectId', getProjectDetails);

/* =========================================================
   📥 DOWNLOAD PROJECT SUBMISSION
   GET /api/admin/projects/:projectId/submission
========================================================= */
router.get('/:projectId/submission', downloadSubmission);

/* =========================================================
   🔓 CONFIRM MANUAL PAYMENT & UNLOCK PROJECT
   POST /api/admin/projects/:projectId/unlock
========================================================= */
router.post('/:projectId/unlock', confirmManualPayment);

/* =========================================================
   💸 PAYOUT TO EXPERT
   POST /api/admin/projects/:projectId/payout
========================================================= */
router.post('/:projectId/payout', payoutProject);

/* =========================================================
   💰 REFUND PROJECT
   POST /api/admin/projects/:projectId/refund
========================================================= */
router.post('/:projectId/refund', refundProject);

export default router;
