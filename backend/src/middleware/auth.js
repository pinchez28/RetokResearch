import jwt from 'jsonwebtoken';
import User from '../models/auth/User.js';

// ---------------------- UNIVERSAL PROTECT ----------------------
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

      if (user.role !== 'admin') await user.populate('profile');
      req.user = user;

      next();
    } catch (err) {
      console.error(err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ---------------------- ROLE-BASED PROTECTORS ----------------------
export const protectAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

export const protectExpert = (req, res, next) => {
  if (!req.user || req.user.role !== 'expert') {
    return res.status(403).json({ message: 'Forbidden: Experts only' });
  }
  next();
};

export const protectClient = (req, res, next) => {
  if (!req.user || req.user.role !== 'client') {
    return res.status(403).json({ message: 'Forbidden: Clients only' });
  }
  next();
};

// ---------------------- ADMIN CHECK (existing) ----------------------
export const adminOnly = protectAdmin;
