import Notification from '../../models/notification/Notification.js';

// -------------------- GET NOTIFICATIONS --------------------
// Fetch notifications for logged-in user (global + role + user)
export const getNotifications = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    // Capitalize role to match enum values
    const role = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    const notifications = await Notification.find({
      $or: [
        { userId: null, userType: null }, // global notifications
        { userType: role }, // role-specific notifications
        { userId }, // user-specific notifications
      ],
    }).sort({ createdAt: -1 });

    console.log(`Notifications for ${userRole} (${userId}):`, notifications);

    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- CREATE NOTIFICATION --------------------
// Can create global, role-specific, or user-specific notification
export const createNotification = async ({
  userId = null,
  userType = null,
  title,
  message,
  jobId = null,
}) => {
  try {
    // Capitalize userType to match schema enum
    if (userType)
      userType = userType.charAt(0).toUpperCase() + userType.slice(1);

    const notification = await Notification.create({
      userId,
      userType,
      title,
      message,
      jobId,
    });

    console.log('Created notification:', notification);
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
};

// -------------------- MARK NOTIFICATIONS AS READ --------------------
export const markNotificationsRead = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;

    // Capitalize role to match enum values
    const role = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    const result = await Notification.updateMany(
      {
        $or: [
          { userId: null, userType: null }, // global
          { userType: role }, // role-specific
          { userId }, // user-specific
        ],
        read: false,
      },
      { $set: { read: true } }
    );

    console.log(
      `${result.modifiedCount} notifications marked as read for ${userRole} (${userId})`
    );
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    console.error('Error marking notifications read:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
