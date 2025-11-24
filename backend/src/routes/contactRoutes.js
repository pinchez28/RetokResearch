// src/routes/contactRoutes.js
import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';

const router = express.Router();

// Public route: submit contact form
router.post('/', createContactMessage);

// Admin routes: list, update, delete messages
router.get('/', getContactMessages);
router.patch('/:id/status', updateContactMessageStatus);
router.delete('/:id', deleteContactMessage);

export default router;
