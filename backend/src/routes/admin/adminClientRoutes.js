import express from 'express';
import {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientProjects, // <-- import the new controller
} from '../../controllers/admin/adminClientController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminOnly);

router.get('/', getAllClients);
router.get('/:id', getClientById);
router.get('/:id/projects', getClientProjects); // <-- new route
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
