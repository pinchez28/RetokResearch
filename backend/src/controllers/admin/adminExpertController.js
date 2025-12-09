import Expert from '../../models/expert/Expert.js';
import User from '../../models/auth/User.js';
import Notification from '../../models/notification/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

// ---------------- Get All Experts ----------------
export const getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ status: 'approved' }).lean();
    res.json({ success: true, data: experts });
  } catch (err) {
    console.error('getAllExperts error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experts',
      error: err.message,
    });
  }
};

// ---------------- Get Pending Experts ----------------
export const getPendingExperts = async (req, res) => {
  try {
    const pendingExperts = await Expert.find({ status: 'pending_admin_review' })
      .populate('user', 'email')
      .lean();

    res.json({ success: true, data: pendingExperts });
  } catch (err) {
    console.error('getPendingExperts error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experts',
      error: err.message,
    });
  }
};

// ---------------- Approve Expert ----------------
export const approveExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const expert = await Expert.findById(expertId).populate('user', 'email');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    expert.status = 'approved';
    await expert.save();

    // Optionally, update the corresponding User role to Expert
    await User.findByIdAndUpdate(expert.user._id, { role: 'Expert' });

    // Notify Expert
    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Account Approved',
      message: 'Your expert account has been approved by admin.',
      read: false,
    });

    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Account Approved',
      html: `<p>Hi ${expert.name}, your expert account has been approved. You can now access your dashboard.</p>`,
    });

    res.json({ success: true, message: 'Expert approved', expert });
  } catch (err) {
    console.error('approveExpert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to approve expert',
      error: err.message,
    });
  }
};

// ---------------- Reject Expert ----------------
export const rejectExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const expert = await Expert.findById(expertId).populate('user', 'email');
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    expert.status = 'rejected';
    await expert.save();

    // Notify Expert
    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Account Rejected',
      message: 'Your expert account has been rejected by admin.',
      read: false,
    });

    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Account Rejected',
      html: `<p>Hi ${expert.name}, your expert account has been rejected by admin. Please contact support for more information.</p>`,
    });

    res.json({ success: true, message: 'Expert rejected', expert });
  } catch (err) {
    console.error('rejectExpert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to reject expert',
      error: err.message,
    });
  }
};
