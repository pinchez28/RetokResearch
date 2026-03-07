// src/core/api/notificationApi.js
import api from './http.js';

/**
 * Fetch all notifications
 * @returns {Promise<Array>} Array of notifications
 */
export const fetchNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    return res.data.notifications || [];
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    throw err;
  }
};

/**
 * Mark notifications as read
 * @param {Array|string} ids - Notification ID(s)
 */
export const markNotificationsRead = async (ids) => {
  try {
    await api.put('/notifications/read', {
      ids: Array.isArray(ids) ? ids : [ids],
    });
  } catch (err) {
    console.error('Failed to mark notifications as read:', err);
    throw err;
  }
};

/**
 * Delete a notification
 * @param {string} id - Notification ID
 */
export const deleteNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`);
  } catch (err) {
    console.error('Failed to delete notification:', err);
    throw err;
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async () => {
  try {
    await api.delete('/notifications/clear');
  } catch (err) {
    console.error('Failed to clear notifications:', err);
    throw err;
  }
};

/**
 * Send a new notification
 * @param {Object} payload - { title, message, userType }
 */
export const sendNotification = async (payload) => {
  try {
    const res = await api.post('/notifications', payload);
    return res.data;
  } catch (err) {
    console.error('Failed to send notification:', err);
    throw err;
  }
};

// REMOVED: markAllNotificationsRead function completely
