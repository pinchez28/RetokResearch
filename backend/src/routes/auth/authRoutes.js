// src/routes/auth/authRoutes.js
import express from 'express';
import { signup, login } from '../../controllers/auth/authController.js';
import multer from 'multer';

const router = express.Router();

// Middleware for file upload (for expert)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/experts'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Client signup (no file)
router.post('/clients/signup', (req, res) => {
  req.body.role = 'client';
  signup(req, res);
});

// Expert signup (with photo)
router.post('/experts/signup', upload.single('photo'), (req, res) => {
  req.body.role = 'expert';
  signup(req, res);
});

// Login for all roles
router.post('/login', login);

export default router;
