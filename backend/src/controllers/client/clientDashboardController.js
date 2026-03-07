import Job from '../../models/client/Job.js';
import Notification from '../../models/notification/Notification.js';
import User from '../../models/auth/User.js';

// DTOs
import { jobClientDTO } from '../../dtos/job/job.client.dto.js';

/* -------------------------------------------------------
   GET CLIENT PROFILE
------------------------------------------------------- */
export const getClientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('profile', 'name')
      .lean();

    if (!user || !user.profile)
      return res
        .status(404)
        .json({ success: false, message: 'Client not found' });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.profile.name,
      },
    });
  } catch (err) {
    console.error('getClientProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* -------------------------------------------------------
   GET CLIENT STATS
------------------------------------------------------- */
export const getClientStats = async (req, res) => {
  try {
    const clientId = req.user.profile;

    const jobs = await Job.find({ client: clientId }).select('status');

    const active = jobs.filter((j) =>
      ['assigned', 'in_progress', 'ready'].includes(j.status)
    ).length;

    const completed = jobs.filter((j) => j.status === 'completed').length;

    const pendingPayments = jobs.filter((j) => j.status === 'ready').length;

    res.json({
      success: true,
      data: { active, completed, pendingPayments },
    });
  } catch (err) {
    console.error('getClientStats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* -------------------------------------------------------
   GET CLIENT PROJECTS (paginated)
------------------------------------------------------- */
export const getClientProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const clientId = req.user.profile;

    const total = await Job.countDocuments({ client: clientId });

    const jobs = await Job.find({ client: clientId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: jobs.map(jobClientDTO), // ✅ DTO enforced
      total,
    });
  } catch (err) {
    console.error('getClientProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* -------------------------------------------------------
   CLIENT DASHBOARD OVERVIEW
------------------------------------------------------- */
export const getClientDashboard = async (req, res) => {
  try {
    const clientId = req.user.profile;

    const totalJobs = await Job.countDocuments({ client: clientId });

    const activeJobs = await Job.countDocuments({
      client: clientId,
      status: { $in: ['assigned', 'in_progress', 'ready'] },
    });

    const notificationsCount = await Notification.countDocuments({
      userType: 'Client',
      userId: clientId,
      read: false,
    });

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        notificationsCount,
      },
    });
  } catch (err) {
    console.error('getClientDashboard error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
    });
  }
};

/* -------------------------------------------------------
   GET CLIENT NOTIFICATIONS
------------------------------------------------------- */
export const getClientNotifications = async (req, res) => {
  try {
    const clientId = req.user.profile;

    const notifications = await Notification.find({
      userType: 'Client',
      userId: clientId,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, notifications });
  } catch (err) {
    console.error('getClientNotifications error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};
