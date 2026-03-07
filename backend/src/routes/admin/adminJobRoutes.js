// routes/admin/adminJobRoutes.js
import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getAllJobs,
  getActiveJobs,
  getPendingJobs,
  getCompletedJobs,
  getJobsSummary,
  getJobById,
  reviewJob,
  rejectJob,
  adminOverrideAssignment,
  deleteJob,
  getApprovedExperts,
  assignExpertToJob,
  approveWork, // ✅ new import
} from '../../controllers/admin/adminJobController.js';

const router = express.Router();

// 🔐 Admin-only guard
const adminGuard = [authMiddleware, authorizeRoles('Admin')];

/* =======================================================
   📊 DASHBOARD & JOB LISTING
======================================================= */

// Dashboard summary
router.get('/summary', adminGuard, getJobsSummary);

// All jobs (admin overview)
router.get('/', adminGuard, getAllJobs);

// Pending jobs (review queue)
router.get('/pending', adminGuard, getPendingJobs);

// Active jobs
router.get('/active', adminGuard, getActiveJobs);

// Completed jobs
router.get('/completed', adminGuard, getCompletedJobs);

/* =======================================================
   🎯 ASSIGN EXPERT ENDPOINTS
======================================================= */

// Get all approved experts for assignment
router.get('/approved-experts', adminGuard, getApprovedExperts);

// Assign an expert to a job
router.post('/:jobId/assign', adminGuard, assignExpertToJob);

/* =======================================================
   🛠 ADMIN ACTIONS
======================================================= */

// Review & approve job
router.patch('/:jobId/review', adminGuard, reviewJob);

// Reject job
router.patch('/:jobId/reject', adminGuard, rejectJob);

// Admin override (reassign / unlock job)
router.patch(
  '/:jobId/override-assignment',
  adminGuard,
  adminOverrideAssignment,
);

// ✅ Approve final work / client-requested revision
router.patch('/:jobId/approve-work', adminGuard, approveWork);

// Delete job (hard delete)
router.delete('/:jobId', adminGuard, deleteJob);

/* =======================================================
   ⚠ GET SINGLE JOB (KEEP LAST)
======================================================= */

// Get a single job by ID
router.get('/:jobId', adminGuard, getJobById);

export default router;
