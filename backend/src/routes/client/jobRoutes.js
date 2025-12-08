import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  createJob,
  getClientJobs,
} from '../../controllers/client/jobController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';

const router = express.Router();

// -------------------- ENSURE UPLOAD DIRECTORY EXISTS --------------------
const uploadDir = path.join('uploads', 'jobs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|png|jpg|jpeg/;
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else
      cb(
        new Error(
          'Unsupported file type. Allowed: pdf, doc, docx, png, jpg, jpeg'
        )
      );
  },
});

// -------------------- ROUTES --------------------
/**
 * POST /api/client/jobs
 * Client posts a new job (goes to admin for review)
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('Client'),
  (req, res, next) => {
    upload.array('attachments', 10)(req, res, (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  createJob
);

/**
 * GET /api/client/jobs
 * Get all jobs posted by the logged-in client
 */
router.get('/', authMiddleware, authorizeRoles('Client'), getClientJobs);

export default router;
