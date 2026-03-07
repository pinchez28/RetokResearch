import Notification from '../src/models/notification/Notification.js';
import sendEmail from './sendEmail.js';
import User from '../src/models/auth/User.js';

/**
 * Master Notification Function
 * Handles:
 *  - Global notifications
 *  - Role-based notifications (Admin, Client, Expert)
 *  - User-specific notifications
 *  - Optional email notifications
 *
 * @param {Object} params
 * @param {Array} params.userIds              Array of user IDs to notify (optional)
 * @param {String|null} params.userType       'Admin' | 'Client' | 'Expert' | null
 * @param {String} params.title               Notification title
 * @param {String} params.message             Notification message
 * @param {String|null} params.link           Optional link to dashboard/job/etc
 * @param {Boolean} params.sendEmailFlag      Whether to send email (default: false)
 */
export const notify = async ({
  userIds = [],
  userType = null,
  title,
  message,
  link = null,
  sendEmailFlag = false,
}) => {
  try {
    // -------------------------
    // GLOBAL NOTIFICATION
    // -------------------------
    if (userIds.length === 0 && !userType) {
      await Notification.create({
        title,
        message,
        link,
        read: false,
      });
      return;
    }

    // -------------------------
    // ROLE / USER-SPECIFIC
    // -------------------------
    for (const userId of userIds) {
      // Save to DB
      await Notification.create({
        userId,
        userType,
        title,
        message,
        link,
        read: false,
      });

      // Send Email If Enabled
      if (sendEmailFlag && userId) {
        const user = await User.findById(userId).select('email');
        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: title,
            html: `
              <p>${message}</p>
              ${
                link
                  ? `<p><a href="${link}">Click here to view details</a></p>`
                  : ''
              }
            `,
          });
        }
      }
    }
  } catch (err) {
    console.error('notify() error:', err.message);
  }
};

/**
 * Notify **all users of a specific role**
 * Example:
 *   createNotificationForUsers("Admin", "New Job", "A new job was created")
 *
 * @param {String} userType          'Admin' | 'Client' | 'Expert'
 * @param {String} title
 * @param {String} message
 * @param {String|null} link
 */
export const createNotificationForUsers = async (
  userType,
  title,
  message,
  link = null
) => {
  try {
    await notify({
      userIds: [], // No specific users
      userType, // Notify entire role type
      title,
      message,
      link,
      sendEmailFlag: false,
    });
  } catch (err) {
    console.error('createNotificationForUsers() error:', err.message);
  }
};
