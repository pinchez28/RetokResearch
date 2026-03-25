import cron from 'node-cron';
import Expert from '../models/expert/Expert.js';

/**
 * Cron Job: Runs every hour to expire expert subscriptions
 */
export const expireExpertSubscriptions = () => {
  // Runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();

      // Find experts with active subscription but expired date
      const expiredExperts = await Expert.updateMany(
        {
          isPriority: true,
          priorityExpiresAt: { $lte: now },
        },
        {
          isPriority: false,
          priorityExpiresAt: null,
        },
      );

      if (expiredExperts.modifiedCount > 0) {
        console.log(
          `[Subscription Cron] Expired ${expiredExperts.modifiedCount} expert subscriptions at ${now.toISOString()}`,
        );
      }
    } catch (err) {
      console.error('[Subscription Cron] Error expiring subscriptions:', err);
    }
  });
};
