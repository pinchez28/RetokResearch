import Notification from '../src/models/notification/Notification.js';
import sendEmail from './sendEmail.js';
import User from '../src/models/auth/User.js';

export const createNotificationForUsers = async ({
  userIds,
  sender,
  type,
  title,
  message,
  link,
  sendEmailFlag = false,
}) => {
  try {
    for (const userId of userIds) {
      await Notification.create({
        userType: 'User',
        userId,
        title,
        message,
        link,
        read: false,
      });

      if (sendEmailFlag) {
        const user = await User.findById(userId).select('email');
        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: title,
            html: `<p>${message}</p><p><a href="${link}">View</a></p>`,
          });
        }
      }
    }
  } catch (err) {
    console.error('createNotificationForUsers error:', err.message);
  }
};
