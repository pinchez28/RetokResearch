import express from 'express';
import { getExpertAssignments } from '../../controllers/expert/expertAssignmentController.js';
import { protectExpert } from '../../middleware/authMiddleware.js';

const router = express.Router();

// GET all assignments for logged-in expert
router.get('/', protectExpert, getExpertAssignments);

export default router;
