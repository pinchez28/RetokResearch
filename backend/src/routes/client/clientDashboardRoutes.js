import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getClientProfile,
  getClientStats,
  getClientProjects,
} from '../../controllers/client/clientDashboardController.js';

const router = express.Router();

router.get(
  '/profile',
  authMiddleware,
  authorizeRoles('Client'),
  getClientProfile
);
router.get('/stats', authMiddleware, authorizeRoles('Client'), getClientStats);
router.get(
  '/projects',
  authMiddleware,
  authorizeRoles('Client'),
  getClientProjects
);

export default router;
