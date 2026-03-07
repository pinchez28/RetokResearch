import Expert from '../../models/expert/Expert.js';
import User from '../../models/auth/User.js';
import Notification from '../../models/notification/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * =========================================
 * GET ALL APPROVED EXPERTS (Admin Assignment)
 * =========================================
 */
export const getApprovedExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ status: 'approved' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: experts,
    });
  } catch (err) {
    console.error('getApprovedExperts error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved experts',
    });
  }
};

/**
 * =========================================
 * GET PENDING EXPERTS (Admin Review)
 * =========================================
 */
export const getPendingExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ status: 'pending_admin_review' })
      .select(
        'name phone photo specialization bio experience education certifications cvPdf status pendingUpdates'
      )
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: experts });
  } catch (err) {
    console.error('getPendingExperts error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending experts',
    });
  }
};

/**
 * =========================================
 * GET SINGLE EXPERT
 * =========================================
 */
export const getExpertById = async (req, res) => {
  try {
    let expert = await Expert.findById(req.params.expertId)
      .select(
        'name phone photo specialization bio experience education certifications cvPdf status pendingUpdates'
      )
      .populate('user', 'name email');

    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    // 🔹 Merge pending updates into the main object for frontend
    if (expert.pendingUpdates && Object.keys(expert.pendingUpdates).length) {
      const fieldsToCheck = [
        'bio',
        'specialization',
        'certifications',
        'education',
        'experience',
        'cvPdf',
        'photo',
      ];

      fieldsToCheck.forEach((key) => {
        const pendingValue = expert.pendingUpdates[key];

        // Only overwrite if pending update is meaningful
        if (
          pendingValue !== undefined &&
          (typeof pendingValue !== 'string' || pendingValue.trim() !== '') &&
          (!Array.isArray(pendingValue) || pendingValue.length > 0)
        ) {
          expert[key] = pendingValue;
        }
      });
    }

    res.status(200).json({ success: true, data: expert });
  } catch (err) {
    console.error('getExpertById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * =========================================
 * APPROVE EXPERT
 * =========================================
 */
export const approveExpert = async (req, res) => {
  try {
    const { expertId } = req.params;

    const expert = await Expert.findById(expertId).populate(
      'user',
      'name email'
    );
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    // Apply pending updates if exist
    if (expert.pendingUpdates && Object.keys(expert.pendingUpdates).length) {
      for (const key of [
        'bio',
        'specialization',
        'certifications',
        'education',
        'experience',
        'cvPdf',
      ]) {
        if (expert.pendingUpdates[key] !== undefined) {
          expert[key] = expert.pendingUpdates[key];
        }
      }
      expert.pendingUpdates = {}; // clear after applying
    }

    expert.status = 'approved';
    expert.approvedAt = new Date();
    await expert.save();

    // Update user role
    await User.findByIdAndUpdate(expert.user._id, {
      role: 'Expert',
      isApproved: true,
    });

    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Account Approved',
      message:
        'Your expert account has been approved. You can now access your dashboard.',
      read: false,
    });

    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Account Approved',
      html: `<p>Hello ${expert.user.name},</p>
             <p>Your expert account has been approved. You may now log in and access your dashboard.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'Expert approved successfully',
      data: expert,
    });
  } catch (err) {
    console.error('approveExpert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to approve expert',
    });
  }
};

/**
 * =========================================
 * REJECT EXPERT SIGNUP (Admin)
 * =========================================
 */
export const rejectExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { rejectionReason } = req.body; // optional reason from admin

    if (!rejectionReason) {
      return res
        .status(400)
        .json({ success: false, message: 'Rejection reason is required' });
    }

    const expert = await Expert.findById(expertId).populate(
      'user',
      'name email'
    );
    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    // Update expert status to rejected
    expert.status = 'rejected';
    expert.rejectedAt = new Date();
    expert.rejectionReason = rejectionReason;
    await expert.save();

    // Notify expert via Notification model
    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Account Rejected',
      message: `Your expert account has been rejected by admin. Reason: ${rejectionReason}`,
      read: false,
    });

    // Send email to expert
    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Account Rejected',
      html: `<p>Hello ${expert.user.name},</p>
             <p>Your expert account has been rejected by the admin.</p>
             <p>Reason: ${rejectionReason}</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'Expert signup rejected successfully',
      data: expert,
    });
  } catch (err) {
    console.error('rejectExpert error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to reject expert signup',
    });
  }
};

/**
 * =========================================
 * REJECT PENDING EXPERT UPDATES (Admin)
 * =========================================
 */
export const rejectPendingExpertUpdates = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { rejectionReason } = req.body; // optional reason from admin

    if (!rejectionReason) {
      return res
        .status(400)
        .json({ success: false, message: 'Rejection reason is required' });
    }

    const expert = await Expert.findById(expertId).populate(
      'user',
      'name email'
    );
    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    if (
      !expert.pendingUpdates ||
      Object.keys(expert.pendingUpdates).length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'No pending updates to reject' });
    }

    // Clear pending updates and store reason
    expert.pendingUpdates = {};
    expert.status = 'approved'; // keep account approved
    expert.rejectionReason = rejectionReason;
    await expert.save();

    // Notify expert via Notification model
    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Profile Updates Rejected',
      message: `Your profile updates were rejected by admin. Reason: ${rejectionReason}`,
      read: false,
    });

    // Send email to expert
    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Profile Updates Rejected',
      html: `<p>Hello ${expert.user.name},</p>
             <p>Your profile updates have been rejected by the admin.</p>
             <p>Reason: ${rejectionReason}</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'Pending updates rejected successfully',
      data: expert,
    });
  } catch (err) {
    console.error('rejectPendingExpertUpdates error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to reject pending updates',
    });
  }
};

/**
 * =========================================
 * APPROVE PENDING EXPERT UPDATES (Admin)
 * =========================================
 */
export const approvePendingExpertUpdates = async (req, res) => {
  try {
    const { expertId } = req.params;

    const expert = await Expert.findById(expertId).populate(
      'user',
      'name email'
    );
    if (!expert) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    if (
      !expert.pendingUpdates ||
      Object.keys(expert.pendingUpdates).length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'No pending updates to approve' });
    }

    // Apply pending updates
    const fields = [
      'bio',
      'specialization',
      'certifications',
      'education',
      'experience',
      'cvPdf',
      'photo',
    ];
    fields.forEach((field) => {
      if (expert.pendingUpdates[field] !== undefined) {
        expert[field] = expert.pendingUpdates[field];
      }
    });

    // Clear pending updates
    expert.pendingUpdates = {};
    // Optionally keep status approved
    expert.status = 'approved';

    await expert.save();

    // Notify the expert
    await Notification.create({
      userType: 'Expert',
      userId: expert._id,
      title: 'Profile Updates Approved',
      message: 'Your expert profile updates have been approved by the admin.',
      read: false,
    });

    await sendEmail({
      to: expert.user.email,
      subject: 'Expert Profile Updates Approved',
      html: `<p>Hello ${expert.user.name},</p>
             <p>Your profile updates have been approved by the admin. You may now see the changes in your dashboard.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'Pending updates approved successfully',
      data: expert,
    });
  } catch (err) {
    console.error('approvePendingExpertUpdates error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to approve pending updates',
    });
  }
};
