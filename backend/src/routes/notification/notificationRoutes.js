import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';
import {
  getNotifications,
  createNotification,
  markNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from '../../controllers/notification/notificationController.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', authMiddleware, getNotifications);

// Get only chat moderation notifications (Admin)
router.get(
  '/chat-moderation',
  authMiddleware,
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      const notifications = await Notification.find({
        deleted: false,
        userType: 'Admin',
        category: 'Message',
        action: 'chat_pending_approval',
      }).sort({ createdAt: -1 });

      res.json({ success: true, notifications });
    } catch (err) {
      console.error('Error fetching chat moderation notifications:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// Admin-only: create notifications
router.post('/', authMiddleware, authorizeRoles('Admin'), createNotification);

// Mark notifications as read
router.put('/read', authMiddleware, markNotificationsRead);

// Soft-delete all notifications for user
router.delete('/clear', authMiddleware, clearAllNotifications);

// Soft-delete a specific notification
router.delete('/:id', authMiddleware, deleteNotification);

export default router;
