import express from 'express';
import { createJob } from '../../controllers/client/jobController.js';
import { authMiddleware } from '../../middleware/auth.js';
import { authorizeRoles } from '../../middleware/roles.js'; // fixed import

const router = express.Router();

/**
 * @route   POST /api/client/jobs
 * @desc    Client posts a new job
 * @access  Private (client only)
 */
router.post('/', authMiddleware, authorizeRoles('client'), createJob);

export default router;
