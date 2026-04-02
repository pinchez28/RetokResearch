import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

import {
  getAssignmentById,
  overrideAssignment,
} from '../../controllers/admin/adminAssignmentControlller.js';

const router = express.Router();

router.use(authMiddleware, adminOnly);

// Get assignment details
router.get('/assignments/:assignmentId', getAssignmentById);

// Override assignment
router.patch('/assignments/:assignmentId/override', overrideAssignment);

export default router;
