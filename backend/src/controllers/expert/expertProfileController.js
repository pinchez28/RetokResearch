import User from '../../models/auth/User.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/notification/Notification.js';
import { persistCertifications } from '../../../utils/persistCertifications.js';

/* =======================================================
   GET EXPERT PROFILE
   Uses logged-in User._id
======================================================= */
export const getExpertProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'Expert') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const expert = await Expert.findOne({ user: user._id });

    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    // Merge user info into the expert profile response
    const profileData = {
      _id: expert._id,
      name: expert.name, // ✅ include name from User
      email: user.email,
      role: user.role,
      specialization: expert.specialization,
      bio: expert.bio,
      experience: expert.experience,
      education: expert.education,
      certifications: expert.certifications,
      photo: expert.photo,
      cvPdf: expert.cvPdf,
      pendingUpdates: expert.pendingUpdates,
      updateStatus: expert.updateStatus,
    };

    res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (err) {
    console.error('Get expert profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =======================================================
   UPDATE EXPERT PROFILE
   Stores changes as pendingUpdates (Admin approval)
======================================================= */
export const updateExpertProfile = async (req, res) => {
  try {
    // ----------------- GET USER -----------------
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'Expert') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // ----------------- GET EXPERT PROFILE -----------------
    const expert = await Expert.findOne({ user: user._id });

    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }

    // ----------------- PREPARE UPDATES -----------------
    const editableFields = [
      'specialization',
      'bio',
      'experience',
      'education',
      'certifications',
    ];

    const pendingUpdates = {};

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        pendingUpdates[field] =
          field === 'certifications'
            ? persistCertifications(req.body[field])
            : req.body[field];
      }
    }

    // ----------------- FILE UPLOADS -----------------
    if (req.files?.photo?.[0]) {
      pendingUpdates.photo = `/uploads/experts/${req.files.photo[0].filename}`;
    }

    if (req.files?.cvPdf?.[0]) {
      pendingUpdates.cvPdf = `/uploads/experts/${req.files.cvPdf[0].filename}`;
    }

    if (!Object.keys(pendingUpdates).length) {
      return res.status(400).json({
        message: 'No updates provided.',
      });
    }

    // ----------------- SAVE PENDING UPDATES -----------------
    expert.pendingUpdates = {
      ...expert.pendingUpdates,
      ...pendingUpdates,
    };

    expert.updateStatus = 'pending';
    await expert.save();

    // ----------------- NOTIFY ADMIN -----------------
    await Notification.create({
      userType: 'Admin',
      title: 'Expert Profile Update Pending Approval',
      message: `${expert.name} submitted profile updates.`,
    });

    // Socket notification (if available)
    req.app.get('io')?.emit('new-admin-notification', {
      title: 'Expert Profile Update Pending Approval',
      message: `${expert.name} submitted profile updates.`,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updates submitted for admin approval.',
      updateStatus: expert.updateStatus,
      pendingUpdates: expert.pendingUpdates,
    });
  } catch (err) {
    console.error('Update expert profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
