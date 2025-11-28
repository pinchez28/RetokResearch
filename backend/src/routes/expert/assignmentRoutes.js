import express from 'express';
import { getExpertAssignments } from '../../controllers/expert/assignmentController.js';
import { protectExpert } from '../../middleware/auth.js';

const router = express.Router();

// GET all assignments for logged-in expert
router.get('/', protectExpert, getExpertAssignments);

export default router;
