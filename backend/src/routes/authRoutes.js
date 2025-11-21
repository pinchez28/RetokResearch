import express from 'express';
import {
  signUp,
  login,
  getCurrentUser,
} from '../controllers/authController.js';
import upload from '../utils/upload.js'; // multer
import { protect } from '../middleware/auth.js'; // we will create this

const router = express.Router();

// Register route (with photo)
router.post('/signup', upload.single('photo'), signUp);

// Login route
router.post('/login', login);

// Get current user
router.get('/me', protect, getCurrentUser);

export default router;
