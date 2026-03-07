// backend/src/routes/admin/adminServiceRoutes.js
import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../../controllers/admin/adminServiceController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(authorizeRoles('Admin'));

// Admin service management routes
router.get('/', getServices); // GET /api/admin/services
router.get('/:id', getServiceById); // GET /api/admin/services/:id
router.post('/', createService); // POST /api/admin/services
router.put('/:id', updateService); // PUT /api/admin/services/:id
router.delete('/:id', deleteService); // DELETE /api/admin/services/:id

export default router;
