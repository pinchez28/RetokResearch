import Notification from '../../models/notification/Notification.js';

// GET /api/client/notifications
export const getClientNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      userType: 'Client',
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications',
    });
  }
};

// PUT /api/client/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notif) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notif.read = true;
    await notif.save();

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// PUT /api/client/notifications/read-all
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// DELETE /api/client/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// DELETE /api/client/notifications/clear-all
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      message: 'All notifications cleared',
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
