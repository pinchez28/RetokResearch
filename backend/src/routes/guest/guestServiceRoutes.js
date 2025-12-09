import express from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../controllers/guest/guestServiceController.js';

// Import each middleware from its own file
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', authMiddleware, adminOnly, createService);
router.put('/:id', authMiddleware, adminOnly, updateService);
router.delete('/:id', authMiddleware, adminOnly, deleteService);

export default router;
