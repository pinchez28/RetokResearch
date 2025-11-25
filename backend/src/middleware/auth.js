import jwt from 'jsonwebtoken';
import User from '../models/auth/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).populate('profile');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      next();
    } catch (err) {
      console.error(err);

      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ message: 'Token expired', roleAttempted: err?.role });
      }

      return res
        .status(401)
        .json({
          message: 'Not authorized, token invalid',
          roleAttempted: err?.role,
        });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
