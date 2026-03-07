// backend/src/routes/expert/expertRoutes.js
import express from 'express';
import {
  authMiddleware,
  protectExpert,
} from '../../middleware/authMiddleware.js';
import {
  uploadCV,
  uploadFinalWork,
} from '../../middleware/uploadMiddleware.js';

// Controllers
import {
  getExpertProfile,
  updateExpertProfile,
} from '../../controllers/expert/expertProfileController.js';

import {
  getExpertStats,
  getExpertProposals,
  getExpertProjects,
} from '../../controllers/expert/expertDashboardController.js';

import {
  getAvailableJobs,
  getJobDetails,
  applyForJob,
} from '../../controllers/expert/expertJobController.js';

import {
  getExpertAssignments,
  getExpertAssignmentDetails,
  confirmGuestAssignment,
  confirmAssignment,
  submitGuestWork,
  submitWork,
  acknowledgeRevision,
} from '../../controllers/expert/expertAssignmentController.js';

import { getEarnings } from '../../controllers/expert/expertEarningsController.js';

const router = express.Router();

router.use((req, res, next) => {
  next();
});

// 🔐 AUTH ONLY (pending experts allowed)
router.use(authMiddleware);

// ================= PROFILE (PENDING OK) =================
router.get('/profile', getExpertProfile);
router.put('/profile', updateExpertProfile);

// ================= APPROVED EXPERT ONLY =================
router.get('/stats', protectExpert, getExpertStats);
router.get('/proposals', protectExpert, getExpertProposals);
router.get('/projects', protectExpert, getExpertProjects);

router.get('/jobs', protectExpert, getAvailableJobs);
router.get('/jobs/:jobId', protectExpert, getJobDetails);
router.post('/jobs/:jobId/apply', protectExpert, uploadCV, applyForJob);

// ================= ASSIGNMENTS =================
router.get('/assignments', protectExpert, getExpertAssignments);
router.get(
  '/assignments/:assignmentId',
  protectExpert,
  getExpertAssignmentDetails,
);
router.post(
  '/guest-assignments/:id/confirm',
  authMiddleware,
  confirmGuestAssignment,
);
router.patch(
  '/assignments/:assignmentId/confirm',
  protectExpert,
  confirmAssignment,
); // ✅ Confirm assignment (assigned → in_progress)

// Submit guest assignment
router.put(
  '/guest-assignments/:id/submit',
  protectExpert,
  uploadFinalWork,
  submitGuestWork,
);

router.put(
  '/assignments/:assignmentId/submit',

  protectExpert,
  uploadFinalWork,
  submitWork,
); // ✅ Submit work
router.put(
  '/assignments/:assignmentId/revision',
  protectExpert,
  acknowledgeRevision,
); // ✅ Acknowledge revision

// ================= EARNINGS =================
router.get('/earnings', protectExpert, getEarnings);

export default router;
