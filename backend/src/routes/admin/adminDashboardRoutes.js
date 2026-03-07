import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';

import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import Job from '../../models/client/Job.js';
import Notification from '../../models/notification/Notification.js';

const router = express.Router();

/* -------------------------------------------------------
   ADMIN DASHBOARD — OVERVIEW STATS
------------------------------------------------------- */
router.get(
  '/dashboard',
  authMiddleware,
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      const totalClients = await Client.countDocuments();
      const totalExperts = await Expert.countDocuments();
      const totalJobs = await Job.countDocuments();

      const pendingExpertApprovals = await Expert.countDocuments({
        status: 'Pending',
      });

      const unreadNotifications = await Notification.countDocuments({
        userType: 'Admin',
        read: false,
      });

      res.json({
        success: true,
        stats: {
          totalClients,
          totalExperts,
          totalJobs,
          pendingExpertApprovals,
          unreadNotifications,
        },
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load admin dashboard',
      });
    }
  }
);

/* -------------------------------------------------------
   ADMIN — FETCH ALL SYSTEM NOTIFICATIONS
------------------------------------------------------- */
router.get(
  '/notifications',
  authMiddleware,
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      const notifications = await Notification.find({
        $or: [{ userType: 'Admin' }, { userType: null }], // admin AND global
      }).sort({ createdAt: -1 });

      res.json(notifications);
    } catch (error) {
      console.error('Admin notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admin notifications',
      });
    }
  }
);

export default router;
