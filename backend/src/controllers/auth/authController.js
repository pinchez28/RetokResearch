import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/notification/Notification.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../../utils/sendEmail.js';
import { persistCertifications } from '../../../utils/persistCertifications.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../../utils/generateToken.js';

const roleModelMap = {
  Client,
  Expert,
};

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    let {
      role,
      name,
      email,
      password,
      phone,
      specialization,
      bio,
      experience,
      education,
      certifications,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    role = role.trim().toLowerCase();
    if (!['client', 'expert'].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Invalid role. Only client or expert allowed.' });
    }
    role = role.charAt(0).toUpperCase() + role.slice(1); // Client | Expert

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    // ---------------- STEP 1: CREATE USER ----------------
    const user = new User({ email, password, role });
    await user.save();

    let profile;

    // ---------------- STEP 2: CREATE PROFILE ----------------
    if (role === 'Client') {
      profile = new Client({ name, phone, user: user._id });
      await profile.save();
    } else if (role === 'Expert') {
      if (!specialization || !bio || !experience || !education) {
        return res
          .status(400)
          .json({ message: 'Missing expert-specific fields.' });
      }

      // ---------------- PARSE CERTIFICATIONS SAFELY ----------------
      let certificationsArray = [];
      if (certifications) {
        if (typeof certifications === 'string') {
          // comma-separated string
          certificationsArray = certifications
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
        } else if (Array.isArray(certifications)) {
          // array from frontend
          certificationsArray = certifications
            .map((c) => c.trim())
            .filter(Boolean);
        }
      }

      // ---------------- HANDLE FILES ----------------
      const photo = req.files?.photo?.[0]?.filename
        ? `/uploads/experts/${req.files.photo[0].filename}`
        : '';
      const cvPdf = req.files?.cvPdf?.[0]?.filename
        ? `/uploads/experts/${req.files.cvPdf[0].filename}`
        : '';

      profile = new Expert({
        name,
        phone,
        user: user._id,
        photo,
        specialization,
        bio,
        experience,
        education,
        certifications: certificationsArray,
        cvPdf,
        status: 'pending_admin_review',
        rating: 0,
      });

      await profile.save();

      // ---------------- ADMIN NOTIFICATION ----------------
      await Notification.create({
        userType: 'Admin',
        title: 'New Expert Signup Pending Approval',
        message: `${profile.name} signed up as Expert.`,
      });

      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      if (ADMIN_EMAIL) {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: 'New Expert Signup Pending Approval',
          html: `<p>${profile.name} signed up as Expert.</p>`,
        });
      }
    }

    // ---------------- STEP 3: LINK PROFILE ----------------
    user.profile = profile._id;
    await user.save();

    // ---------------- STEP 4: RESPONSE ----------------
    if (role === 'Client') {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      const populatedUser = await User.findById(user._id).populate({
        path: 'profile',
        model: Client,
      });

      return res.status(201).json({ accessToken, user: populatedUser });
    }

    // ---------------- EXPERT RESPONSE ----------------
    // Populate Expert fully including certifications
    const populatedExpert = await Expert.findById(profile._id).lean();

    return res.status(201).json({
      message:
        'Expert signup successful. Your account is pending admin approval.',
      status: populatedExpert.status,
      expert: populatedExpert, // ✅ includes certifications
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    // ---------------- EXPERT CHECK ----------------
    if (user.role === 'Expert') {
      const expertProfile = await Expert.findById(user.profile);
      if (!expertProfile)
        return res.status(404).json({ message: 'Expert profile not found.' });

      if (expertProfile.status !== 'approved') {
        return res.status(403).json({
          message: 'Your account is pending admin approval.',
          status: expertProfile.status,
        });
      }
    }

    // ---------------- TOKENS ----------------
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ---------------- NORMALIZE USER ----------------
    let populatedUser;

    if (user.role === 'Admin') {
      // Admin: no profile, but normalize fields for frontend
      populatedUser = {
        _id: user._id.toString(),
        id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        profile: null,
        profileId: null,
        profileStatus: null,
      };
    } else {
      // Client or Expert: populate profile fully
      const dbUser = await User.findById(user._id)
        .populate({ path: 'profile', model: roleModelMap[user.role] })
        .lean();

      populatedUser = {
        ...dbUser,
        _id: dbUser._id.toString(),
        id: dbUser._id.toString(),
        userId: dbUser._id.toString(),
        profileId: dbUser.profile?._id?.toString() || null,
        profileStatus: dbUser.profile?.status || null,
      };
    }

    // ---------------- RESPONSE ----------------
    res.status(200).json({ accessToken, user: populatedUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (req, res) => {
  try {
    const { _id, role } = req.user;

    let dbUser;

    if (role === 'Admin') {
      // Admin: no profile, normalize fields
      const admin = await User.findById(_id).lean();
      if (!admin) return res.status(404).json({ message: 'User not found.' });

      dbUser = {
        _id: admin._id.toString(),
        id: admin._id.toString(),
        userId: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        profile: null,
        profileId: null,
        profileStatus: null,
      };
    } else {
      // Client or Expert: populate profile fully
      const userWithProfile = await User.findById(_id)
        .populate({ path: 'profile', model: roleModelMap[role] })
        .lean();

      if (!userWithProfile)
        return res.status(404).json({ message: 'User not found.' });

      dbUser = {
        ...userWithProfile,
        _id: userWithProfile._id.toString(),
        id: userWithProfile._id.toString(),
        userId: userWithProfile._id.toString(),
        profileId: userWithProfile.profile?._id?.toString() || null,
        profileStatus: userWithProfile.profile?.status || null,
      };
    }

    res.status(200).json(dbUser);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//------------------- REFRESH TOKEN ----------------

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    // 1️⃣ Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2️⃣ Find user from database
    const user = await User.findById(decoded.id).select('_id role');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 3️⃣ Generate new access token
    const accessToken = generateAccessToken(user);

    // 4️⃣ Send new access token
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired refresh token' });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // ✅ cleanup any legacy access token cookie
    res.clearCookie('accessToken');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
