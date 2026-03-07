import express from 'express';
import {
  getAllGuestMessages,
  getGuestMessageById,
  markMessageReplied,
  deleteGuestMessage,
} from '../../controllers/admin/adminGuestMessagesController.js';
import {
  authMiddleware,
  protectAdmin,
} from '../../middleware/authMiddleware.js';

const router = express.Router();

// GET all messages
router.get('/', authMiddleware, protectAdmin, getAllGuestMessages);

// GET single message
router.get('/:id', authMiddleware, protectAdmin, getGuestMessageById);

// PATCH mark as replied
router.patch('/:id/reply', authMiddleware, protectAdmin, markMessageReplied);

// DELETE a message
router.delete('/:id', authMiddleware, protectAdmin, deleteGuestMessage);

export default router;
