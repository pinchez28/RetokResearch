import express from 'express';
import multer from 'multer';
import { createJob } from '../../controllers/client/jobController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js';

const router = express.Router();

// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/jobs'); // folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// -------------------- ROUTES --------------------
/**

* @route   POST /api/client/jobs
* @desc    Client posts a new job
* @access  Private (Client only)
* Supports multiple file attachments (up to 10)
  */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('Client'),
  upload.array('attachments', 10),
  createJob
);

export default router;
