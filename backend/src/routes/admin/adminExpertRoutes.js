import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getApprovedExperts,
  getPendingExperts,
  getExpertById,
  approveExpert,
  rejectExpert,
  approvePendingExpertUpdates,
  rejectPendingExpertUpdates,
} from '../../controllers/admin/adminExpertController.js';

const router = express.Router();

// ---------------- ADMIN GUARD ----------------
const adminGuard = [authMiddleware, authorizeRoles('Admin')];

// ================================
//        GET ROUTES
// ================================

// Get all approved experts (for job assignment)
router.get('/', adminGuard, getApprovedExperts);

// Get experts pending admin approval (signup or updates)
router.get('/pending', adminGuard, getPendingExperts);

// Get single expert by ID
router.get('/:expertId', adminGuard, getExpertById);

// ================================
//        PATCH ROUTES
// ================================

// Approve expert signup
router.patch('/:expertId/approve', adminGuard, approveExpert);

// Reject expert signup
router.patch('/:expertId/reject', adminGuard, rejectExpert);

// Approve pending expert profile updates
router.patch(
  '/:expertId/pending-updates/approve',
  adminGuard,
  approvePendingExpertUpdates
);

// Reject pending expert profile updates
router.patch(
  '/:expertId/pending-updates/reject',
  adminGuard,
  rejectPendingExpertUpdates
);

export default router;
