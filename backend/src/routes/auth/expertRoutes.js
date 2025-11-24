import express from 'express';
import multer from 'multer';
import { signup, login } from '../../controllers/auth/expertController.js';
import fs from 'fs';

const dir = 'uploads/experts';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const router = express.Router();

// Multer for expert photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/experts/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/signup', upload.single('photo'), signup);
router.post('/login', login);

export default router;
