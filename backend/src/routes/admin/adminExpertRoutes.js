import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getAllExperts,
  getPendingExperts,
  approveExpert,
  rejectExpert,
} from '../../controllers/admin/adminExpertController.js';

const router = express.Router();

// GET /api/admin/experts - fetch all approved experts
router.get('/', authMiddleware, authorizeRoles('Admin'), getAllExperts);

// GET /api/admin/experts/pending - fetch all experts pending approval
router.get(
  '/pending',
  authMiddleware,
  authorizeRoles('Admin'),
  getPendingExperts
);

// PUT /api/admin/experts/:expertId/approve - approve expert
router.put(
  '/:expertId/approve',
  authMiddleware,
  authorizeRoles('Admin'),
  approveExpert
);

// PUT /api/admin/experts/:expertId/reject - reject expert
router.put(
  '/:expertId/reject',
  authMiddleware,
  authorizeRoles('Admin'),
  rejectExpert
);

export default router;
