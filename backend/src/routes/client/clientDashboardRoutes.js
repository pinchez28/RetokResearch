import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';
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
