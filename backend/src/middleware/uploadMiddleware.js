import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure CV uploads directory exists
const cvUploadDir = 'uploads/cvs';
if (!fs.existsSync(cvUploadDir)) fs.mkdirSync(cvUploadDir, { recursive: true });

// Multer storage for CV
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cvUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Only allow PDF/DOC/DOCX for CV
const cvFileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('CV must be PDF, DOC, or DOCX'));
};

// Multer middleware
export const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
}).single('cv'); // only single CV file
