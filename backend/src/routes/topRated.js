import express from 'express';
import {
  getTopRatedExperts,
  createTopRatedExpert,
  updateTopRatedExpert,
  deleteTopRatedExpert,
  reorderTopRatedExperts,
} from '../controllers/topRatedExpertsController.js';

const router = express.Router();

// Get all top rated experts
router.get('/', getTopRatedExperts);

// Create a top rated expert
router.post('/', createTopRatedExpert);

// Update expert at a position
router.put('/:position', updateTopRatedExpert);

// Delete expert at a position
router.delete('/:position', deleteTopRatedExpert);

// Reorder top rated experts
router.put('/reorder', reorderTopRatedExperts);

export default router;
