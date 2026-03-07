import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import { getAdminProfile } from '../../controllers/admin/adminController.js';

const router = express.Router();

// Admin profile endpoint
router.get(
  '/profile',
  authMiddleware,
  authorizeRoles('Admin'),
  getAdminProfile
);

export default router;
