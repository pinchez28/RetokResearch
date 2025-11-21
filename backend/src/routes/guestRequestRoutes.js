import express from 'express';
import {
  createGuestRequest,
  getGuestRequests,
  updateGuestRequestStatus,
  deleteGuestRequest, // new
} from '../controllers/guestRequestController.js';

const router = express.Router();

// Create a new guest request
router.post('/', createGuestRequest);

// Get all guest requests (with pagination/sort handled in controller)
router.get('/', getGuestRequests);

// Update status
router.patch('/:id/status', updateGuestRequestStatus);

// ⭐ Delete a guest request
router.delete('/:id', deleteGuestRequest);

export default router;
