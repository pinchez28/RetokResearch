import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';
import {
  getAboutSection,
  upsertAboutSection,
  updateMission,
  updateVision,
  addCoreValue,
  updateCoreValue,
  deleteCoreValue,
  deleteAboutSection,
} from '../controllers/aboutController.js';

const router = express.Router();

router.get('/', getAboutSection);
router.post('/', protect, isAdmin, upsertAboutSection);

router.put('/mission', protect, isAdmin, updateMission);
router.put('/vision', protect, isAdmin, updateVision);

router.post('/core-values', protect, isAdmin, addCoreValue);
router.put('/core-values/:id', protect, isAdmin, updateCoreValue);
router.delete('/core-values/:id', protect, isAdmin, deleteCoreValue);

router.delete('/', protect, isAdmin, deleteAboutSection);

export default router;
