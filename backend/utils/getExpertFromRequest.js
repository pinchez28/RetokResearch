import Expert from '../src/models/expert/Expert.js';

export const getExpertFromRequest = async (req) => {
  if (!req.user?._id) {
    throw new Error('User not authenticated');
  }

  const expert = await Expert.findOne({ user: req.user._id });

  if (!expert) {
    throw new Error('Expert profile not found for user');
  }

  return expert; // ✅ returns Expert document
};
