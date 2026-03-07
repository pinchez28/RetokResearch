import User from '../../models/auth/User.js';

// GET /api/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('name email role');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin profile' });
  }
};
