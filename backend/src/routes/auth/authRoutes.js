import express from 'express';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../../controllers/auth/authController.js';

import { loginLimiter } from '../../middleware/rateLimitMiddleware.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

// upload middleware for Expert signup
import { uploadExpertSignup } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

/* ================= SIGNUP ================= */

// Client signup
router.post('/clients/signup', (req, res) => {
  req.body.role = 'Client'; // explicitly set role
  signup(req, res);
});

// Expert signup
router.post(
  '/experts/signup',
  uploadExpertSignup, // middleware for photo & cv upload
  (req, res) => {
    req.body.role = 'Expert';
    signup(req, res);
  },
);

/* ================= LOGIN ================= */

router.post('/login', loginLimiter, login);

/* ================= PASSWORD ================= */

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

/* ================= EMAIL ================= */

// Verify email
router.get('/verify-email', verifyEmail);

/* ================= TOKEN ================= */

// Refresh token
router.post('/refresh', refresh);

/* ================= LOGOUT ================= */

router.post('/logout', authMiddleware, logout);

/* ================= CURRENT USER ================= */

router.get('/me', authMiddleware, getCurrentUser);

export default router;
