import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import Admin from '../../models/admin/Admin.js';
import Notification from '../../models/notification/Notification.js';
import EmailToken from '../../models/auth/EmailToken.js';
import Session from '../../models/auth/Session.js';
import crypto from 'crypto';
import sendEmail from '../../../utils/sendEmail.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../../utils/generateToken.js';

const roleModelMap = { Client, Expert };

// Strong password check
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
};

export const signup = async (req, res) => {
  try {
    console.log('req.body:', req.body);

    let role = req.body.role;

    const {
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

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long.',
      });
    }

    // Normalize role
    role = role?.trim().toLowerCase();

    if (!['client', 'expert'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role.',
      });
    }

    role = role.charAt(0).toUpperCase() + role.slice(1);

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists.',
      });
    }

    // Create auth user
    const user = new User({
      email,
      password,
      role,
    });

    await user.save();

    let profile;

    // ================= CLIENT PROFILE =================
    if (role === 'Client') {
      profile = new Client({
        name,
        phone,
        user: user._id,
      });

      await profile.save();
    }

    // ================= EXPERT PROFILE =================
    if (role === 'Expert') {
      if (!specialization || !bio || !experience || !education) {
        return res.status(400).json({
          success: false,
          message: 'Missing expert fields.',
        });
      }

      const certificationsArray = Array.isArray(certifications)
        ? certifications.map((c) => c.trim()).filter(Boolean)
        : (certifications || '')
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);

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

      // Notify Admin
      await Notification.create({
        userType: 'Admin',
        title: 'New Expert Signup Pending Approval',
        message: `${profile.name} signed up as Expert.`,
      });

      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Expert Signup Pending Approval',
          html: `<p>${profile.name} signed up as Expert.</p>`,
        });
      }
    }

    // Attach profile to user
    user.profile = profile._id;
    await user.save();

    // ================= EMAIL VERIFICATION =================

    await EmailToken.deleteMany({ user: user._id });

    const token = crypto.randomBytes(32).toString('hex');

    await EmailToken.create({
      user: user._id,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    const backendURL = process.env.BACKEND_URL || 'http://localhost:4000';

    const verifyURL = `${backendURL}/api/auth/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <p>Please verify your email:</p>
        <a href="${verifyURL}">${verifyURL}</a>
      `,
    });

    // ================= AUTH TOKENS =================

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Session.create({
      user: user._id,
      refreshToken,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ================= RESPONSE =================

    const populatedUser = await User.findById(user._id)
      .select('-password')
      .populate({
        path: 'profile',
        model: roleModelMap[role],
      });

    res.status(201).json({
      success: true,
      accessToken,
      user: populatedUser,
      message: 'Signup successful! Please verify your email.',
    });
  } catch (err) {
    console.error('Signup error:', err);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Email and password required.' });

    const user = await User.findOne({ email }).populate('profile');

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials.' });

    if (!user.isEmailVerified)
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
      });

    if (
      user.role === 'Expert' &&
      (!user.profile || user.profile.status !== 'approved')
    )
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval.',
        status: user.profile?.status,
      });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Session.create({
      success: true,
      user: user._id,
      refreshToken,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (req, res) => {
  try {
    const { _id, role } = req.user;

    const user = await User.findById(_id).populate({
      path: 'profile',
      model: roleModelMap[role],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- REFRESH TOKEN ----------------
export const refresh = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken)
    return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    const session = await Session.findOne({ refreshToken: oldRefreshToken });
    if (!session) {
      await Session.deleteMany({ user: decoded.id });
      return res
        .status(401)
        .json({ message: 'Session invalidated due to token reuse' });
    }

    if (session.expiresAt < Date.now()) {
      await session.deleteOne();
      return res.status(401).json({ message: 'Session expired' });
    }

    const user = await User.findById(decoded.id).select('_id role');
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    session.refreshToken = newRefreshToken;
    session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired refresh token' });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await Session.deleteOne({ refreshToken });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- LOGOUT ALL ----------------
export const logoutAll = async (req, res) => {
  try {
    await Session.deleteMany({ user: req.user._id });
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (err) {
    console.error('Logout all error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset</p><a href="${resetURL}">${resetURL}</a>`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!isStrongPassword(password))
      return res.status(400).json({
        message:
          'Password must contain uppercase, lowercase, number, special character and be 8+ characters long.',
      });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/verification-failed`);
    }

    const emailToken = await EmailToken.findOne({ token });

    if (!emailToken) {
      return res.redirect(`${process.env.FRONTEND_URL}/verification-failed`);
    }

    if (emailToken.expiresAt < Date.now()) {
      return res.redirect(`${process.env.FRONTEND_URL}/verification-failed`);
    }

    const user = await User.findById(emailToken.user);

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/verification-failed`);
    }

    if (user.isEmailVerified) {
      return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
    }

    user.isEmailVerified = true;
    await user.save();

    await EmailToken.deleteOne({ _id: emailToken._id });

    // Redirect to frontend success page
    return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (err) {
    console.error('Email verification error:', err);

    return res.redirect(`${process.env.FRONTEND_URL}/verification-failed`);
  }
};
