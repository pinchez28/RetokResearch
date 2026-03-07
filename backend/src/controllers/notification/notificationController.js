import Notification from '../../models/notification/Notification.js';

// -------------------- GET NOTIFICATIONS --------------------
export const getNotifications = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);

    const notifications = await Notification.find({
      deleted: false,
      $or: [
        { userId: userId }, // personal
        { userType: 'Global' }, // global
        { userType: roleCapitalized, userId: null }, // role broadcast (e.g., Expert)
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- CREATE NOTIFICATION --------------------
export const createNotification = async (req, res) => {
  try {
    let {
      userId = null,
      userType = 'Global',
      title,
      message,
      category = 'General',
      action = null,
      jobId = null,
      messageThreadId = null,
      meta = {},
    } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Title and message are required' });
    }

    // Validate userType
    const validTypes = ['Admin', 'Client', 'Expert', 'Global'];
    if (!validTypes.includes(userType)) userType = 'Global';

    const notification = await Notification.create({
      userId,
      userType,
      title,
      message,
      category,
      action,
      jobId,
      messageThreadId,
      meta,
    });

    res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- MARK NOTIFICATIONS AS READ --------------------
export const markNotificationsRead = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res
        .status(400)
        .json({ success: false, message: 'No IDs provided' });
    }

    const role =
      req.user.role.charAt(0).toUpperCase() +
      req.user.role.slice(1).toLowerCase();

    await Notification.updateMany(
      {
        _id: { $in: ids },
        deleted: false,
        $or: [
          { userId: req.user.id },
          { userType: role },
          { userType: 'Global' },
        ],
      },
      { $set: { read: true, readAt: new Date() } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notifications read:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- SOFT DELETE --------------------
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);

    const deleted = await Notification.findOneAndUpdate(
      {
        _id: id,
        deleted: false,
        $or: [{ userId }, { userType: roleCapitalized }],
      },
      { $set: { deleted: true } },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- CLEAR ALL --------------------
export const clearAllNotifications = async (req, res) => {
  try {
    const roleCapitalized =
      req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

    await Notification.updateMany(
      {
        deleted: false,
        $or: [
          { userId: req.user.id },
          { userType: roleCapitalized },
          { userType: 'Global' },
        ],
      },
      { $set: { deleted: true } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ success: false });
  }
};
