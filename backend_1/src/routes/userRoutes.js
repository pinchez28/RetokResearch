import express from 'express';
import multer from 'multer';
import { signup, login } from '../controllers/userController.js';

const router = express.Router();

// Multer setup for expert photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/experts/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post('/signup', upload.single('photo'), signup);
router.post('/login', login);

export default router;
