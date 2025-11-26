import express from 'express';
import {
  createGuestRequest,
  getGuestRequests,
  deleteGuestRequest,
} from '../../controllers/guest/guestRequestController.js';

const router = express.Router();

// Create a new guest request
router.post('/', createGuestRequest);

// Get all guest requests (paginated)
router.get('/', getGuestRequests);

// Delete a guest request by ID (admin only)
router.delete('/:id', deleteGuestRequest);

export default router;
