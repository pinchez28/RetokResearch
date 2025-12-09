import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getNotifications,
  createNotification,
} from '../../controllers/notification/notificationController.js';

const router = express.Router();

// -------------------- ROUTES --------------------

// GET /api/notifications
// All authenticated users (Client, Expert, Admin) can fetch their notifications
router.get(
  '/',
  authMiddleware,
  authorizeRoles('Client', 'Expert', 'Admin'), // explicit role check
  getNotifications
);

// POST /api/notifications
// Only Admin can create notifications for any user
router.post('/', authMiddleware, authorizeRoles('Admin'), createNotification);

// Optional: mark notifications as read
// router.put('/read', authMiddleware, markNotificationsRead);

export default router;
