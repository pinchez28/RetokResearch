import express from 'express';
import { rewriteJobDescription } from '../../controllers/ai/aiRewriteController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import { aiRewriteLimiter } from '../../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post(
  '/rewrite',
  authMiddleware,
  aiRewriteLimiter,
  rewriteJobDescription
);

export default router;
