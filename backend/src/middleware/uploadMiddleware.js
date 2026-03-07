import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --------------------
// Ensure directories exist
// --------------------
const cvUploadDir = 'uploads/cvs';
const finalWorkDir = 'uploads/finalWork';
const expertUploadDir = 'uploads/experts';

if (!fs.existsSync(cvUploadDir)) fs.mkdirSync(cvUploadDir, { recursive: true });
if (!fs.existsSync(finalWorkDir))
  fs.mkdirSync(finalWorkDir, { recursive: true });
if (!fs.existsSync(expertUploadDir))
  fs.mkdirSync(expertUploadDir, { recursive: true });

// --------------------
// Multer storage for CV
// --------------------
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

// --------------------
// Multer storage for Final Work
// --------------------
const finalWorkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, finalWorkDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Allow PDF, DOC, DOCX, ZIP for final work
const finalWorkFileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Final work must be PDF, DOC, DOCX, or ZIP'));
};

// --------------------
// Multer storage for Expert Signup
// --------------------
const expertStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, expertUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Allow image for photo, PDF for cvPdf
const expertFileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (
    file.fieldname === 'cvPdf' &&
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid expert signup file type'), false);
  }
};

// --------------------
// Export middlewares
// --------------------
export const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
}).single('cv');

export const uploadFinalWork = multer({
  storage: finalWorkStorage,
  fileFilter: finalWorkFileFilter,
}).single('finalWork');

export const uploadExpertSignup = multer({
  storage: expertStorage,
  fileFilter: expertFileFilter,
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cvPdf', maxCount: 1 },
]);
