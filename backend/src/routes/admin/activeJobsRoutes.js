import express from 'express';
import {
  getActiveJobs,
  assignExpert,
  updateJob,
  deleteJob,
} from '../../controllers/admin/jobController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { authorize } from '../../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

// GET /api/admin/jobs/active
router.get('/active', getActiveJobs);

// PUT assign expert
router.put('/:id/assign', assignExpert);

// PUT update job (category, skills, price range, status)
router.put('/:id/update', updateJob);

// DELETE job
router.delete('/:id', deleteJob);

export default router;
