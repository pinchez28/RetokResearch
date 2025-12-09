import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getPendingJobs,
  reviewJob,
  rejectJob,
  getActiveJobs,
  getJobById,
  assignExpert,
  updateJob,
  deleteJob,
} from '../../controllers/admin/adminJobController.js';

const router = express.Router();

// ---------------- GET ROUTES ----------------
router.get('/active', authMiddleware, authorizeRoles('Admin'), getActiveJobs);
router.get('/pending', authMiddleware, authorizeRoles('Admin'), getPendingJobs);
router.get('/:jobId', authMiddleware, authorizeRoles('Admin'), getJobById);

// ---------------- PUT ROUTES ----------------
router.put(
  '/:jobId/review',
  authMiddleware,
  authorizeRoles('Admin'),
  reviewJob
);
router.put(
  '/:jobId/reject',
  authMiddleware,
  authorizeRoles('Admin'),
  rejectJob
);
router.put(
  '/:jobId/assign',
  authMiddleware,
  authorizeRoles('Admin'),
  assignExpert
);
router.put(
  '/:jobId/update',
  authMiddleware,
  authorizeRoles('Admin'),
  updateJob
);

// ---------------- DELETE ROUTE ----------------
router.delete('/:jobId', authMiddleware, authorizeRoles('Admin'), deleteJob);

export default router;
