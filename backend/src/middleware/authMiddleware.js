import jwt from 'jsonwebtoken';
import User from '../models/auth/User.js';
import Expert from '../models/expert/Expert.js';

/**
 * ======================
 * UNIVERSAL AUTH MIDDLEWARE
 * ======================
 * Verifies JWT and attaches normalized user info to req.user.
 * For non-admins, also attaches profileId, profileStatus, and full profile object.
 * Backward compatible with old code expecting _id.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 authMiddleware hit', req.headers.authorization);

    // 1️⃣ Extract Bearer token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no access token',
        code: 'NO_ACCESS_TOKEN',
      });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3️⃣ Fetch user from DB
    let user;
    if (decoded.role === 'Admin') {
      // Admin: no profile
      user = await User.findById(decoded.id).select('-password').lean();
    } else {
      // Clients & Experts: populate profile
      user = await User.findById(decoded.id)
        .select('-password')
        .populate('profile')
        .lean();
    }

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized',
        code: 'USER_NOT_FOUND',
      });
    }

    // 4️⃣ Normalize req.user (robust & backward compatible)
    req.user = {
      _id: user._id.toString(), // old code expects _id
      id: user._id.toString(), // some parts expect id
      userId: user._id.toString(), // new normalized
      role: user.role,
      profile: user.profile || null, // full profile object if exists
      profileId: user.profile?._id?.toString() || null,
      profileStatus: user.profile?.status || null,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token expired',
        code: 'ACCESS_TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      message: 'Not authorized, invalid token',
      code: 'INVALID_ACCESS_TOKEN',
    });
  }
};

/**
 * ======================
 * ROLE-BASED MIDDLEWARE
 * ======================
 */
export const protectAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({
      message: 'Forbidden: Admins only',
      code: 'ADMIN_ONLY',
    });
  }
  next();
};

export const protectExpert = async (req, res, next) => {
  if (!req.user || req.user.role !== 'Expert') {
    return res.status(403).json({
      message: 'Forbidden: Experts only',
      code: 'EXPERT_ONLY',
    });
  }

  if (!req.user.profileId) {
    return res.status(403).json({
      message: 'Expert profile not found',
      code: 'EXPERT_PROFILE_NOT_FOUND',
    });
  }

  const expertProfile = await Expert.findById(req.user.profileId).lean();
  if (!expertProfile || expertProfile.status !== 'approved') {
    return res.status(403).json({
      message: 'Your account is pending admin approval',
      code: 'EXPERT_NOT_APPROVED',
    });
  }

  next();
};

export const protectClient = (req, res, next) => {
  if (!req.user || req.user.role !== 'Client') {
    return res.status(403).json({
      message: 'Forbidden: Clients only',
      code: 'CLIENT_ONLY',
    });
  }
  next();
};

/**
 * ======================
 * ROLE CHECK HELPER
 * ======================
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized',
        code: 'NO_USER',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient role',
        code: 'INSUFFICIENT_ROLE',
      });
    }

    next();
  };
};
