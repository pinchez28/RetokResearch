import express from 'express';
import {
  authMiddleware,
  protectClient,
} from '../../middleware/authMiddleware.js';
import { getJobProposals } from '../../controllers/client/clientProposalController.js';

const router = express.Router();

// List all proposals for a job (client only)
router.get(
  '/jobs/:jobId/proposals',
  authMiddleware,
  protectClient,
  getJobProposals,
);

export default router;
