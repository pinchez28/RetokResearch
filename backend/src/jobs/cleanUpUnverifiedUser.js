import User from '../models/auth/User.js';
import EmailToken from '../models/auth/EmailToken.js';
import Expert from '../models/expert/Expert.js';
import Client from '../models/client/Client.js';

export const cleanupUnverifiedUsers = async () => {
  try {
    const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const users = await User.find({
      isEmailVerified: false,
      createdAt: { $lt: expiryTime },
    });

    for (const user of users) {
      await EmailToken.deleteMany({ user: user._id });

      await Expert.deleteMany({ user: user._id });
      await Client.deleteMany({ user: user._id });

      await User.deleteOne({ _id: user._id });
    }

    if (users.length > 0) {
      console.log(`🧹 Cleaned ${users.length} unverified users`);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};
