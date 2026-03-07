import express from 'express';
import {
  getChatThread,
  sendMessage,
  moderateMessage,
  softDeleteMessage,
} from '../../controllers/chat/chatControler.js';

import { authMiddleware } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/rolesMiddleware.js';

const router = express.Router();

// =======================================================
// GET CHAT THREAD
// - Admin / Client / Expert can view thread
// =======================================================
router.get('/:threadId', authMiddleware, getChatThread);

// =======================================================
// SEND MESSAGE
// - Only Client / Expert participants can send messages
// =======================================================
router.post(
  '/:threadId/messages',
  authMiddleware,
  authorizeRoles('client', 'expert'),
  sendMessage,
);

// =======================================================
// MODERATE MESSAGE
// - Only Admin can approve/reject messages
// =======================================================
router.post(
  '/:threadId/messages/:messageId/moderate',
  authMiddleware,
  authorizeRoles('admin'),
  moderateMessage,
);

// =======================================================
// SOFT DELETE MESSAGE
// - Only the sender can delete their message
// =======================================================
router.delete(
  '/:threadId/messages/:messageId',
  authMiddleware,
  authorizeRoles('client', 'expert'),
  softDeleteMessage,
);

export default router;
