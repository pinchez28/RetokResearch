import jwt from 'jsonwebtoken';
import User from '../models/auth/User.js';
import Expert from '../models/expert/Expert.js';

// ---------------------- UNIVERSAL AUTH MIDDLEWARE ----------------------
export const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'Not authorized' });

      // Optional: populate profile for non-admin users
      if (user.role !== 'Admin') {
        await user.populate('profile');
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Auth error:', err);

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }

      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ---------------------- ROLE-BASED MIDDLEWARE ----------------------
export const protectAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

export const protectExpert = async (req, res, next) => {
  if (!req.user || req.user.role !== 'Expert') {
    return res.status(403).json({ message: 'Forbidden: Experts only' });
  }

  // ✅ Check if expert is approved
  const expertProfile = await Expert.findById(req.user.profile._id);
  if (!expertProfile || expertProfile.status !== 'approved') {
    return res.status(403).json({
      message: 'Your account is pending admin approval. Access denied.',
    });
  }

  next();
};

export const protectClient = (req, res, next) => {
  if (!req.user || req.user.role !== 'Client') {
    return res.status(403).json({ message: 'Forbidden: Clients only' });
  }
  next();
};

// ---------------------- ROLE CHECK HELPER ----------------------
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient role',
      });
    }

    next();
  };
};
