import express from 'express';
import { getApprovedJobs } from '../../controllers/guest/guestJobController.js';

const router = express.Router();

/**
 * @route GET /api/guest/jobs/approved
 * @desc Get all approved jobs
 * @access Public
 */
router.get('/approved', getApprovedJobs);

export default router;
