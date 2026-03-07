import User from '../../models/auth/User.js';

// -------------------- GET PROFILE --------------------
export const getClientProfile = async (req, res) => {
  try {
    const user = req.user; // set by authMiddleware
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        organization: user.organization || '',
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// -------------------- UPDATE PROFILE --------------------
export const updateClientProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

    const { name, email, phone, organization } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (organization) user.organization = organization;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        organization: user.organization,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
