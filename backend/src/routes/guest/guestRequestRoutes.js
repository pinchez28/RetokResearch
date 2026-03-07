import express from 'express';
import { createGuestRequest } from '../../controllers/guest/guestRequestController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';

const router = express.Router();

// -------------------- PUBLIC --------------------
router.post('/', createGuestRequest);

export default router;
