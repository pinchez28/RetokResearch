import express from 'express';

import {
  signup,
  login,
  logout,
  getCurrentUser,
  refresh,
} from '../../controllers/auth/authController.js';

import { authMiddleware } from '../../middleware/authMiddleware.js';

// ✅ USE CENTRALIZED UPLOAD MIDDLEWARE
import { uploadExpertSignup } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

/* ================= SIGNUP ================= */

// Client signup (no files)
router.post('/clients/signup', (req, res) => {
  req.body.role = 'Client';
  signup(req, res);
});

// Expert signup (photo + cvPdf)
router.post('/experts/signup', uploadExpertSignup, (req, res) => {
  req.body.role = 'Expert';
  signup(req, res);
});

/* ================= LOGIN ================= */
router.post('/login', login);

/* ================= REFRESH (🔥 REQUIRED) */
// ❗ NO authMiddleware here
router.post('/refresh', refresh);

/* ================= LOGOUT ================= */
router.post('/logout', authMiddleware, logout);

/* ================= CURRENT USER ================= */
router.get('/me', authMiddleware, getCurrentUser);

export default router;
