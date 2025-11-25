// src/routes/serviceRoutes.js
import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route: get all services
router.get('/', getAllServices);

// Protected routes (admin only)
router.post('/', protect, isAdmin, createService);
router.get('/:id', protect, isAdmin, getServiceById);
router.put('/:id', protect, isAdmin, updateService);
router.delete('/:id', protect, isAdmin, deleteService);

export default router;
