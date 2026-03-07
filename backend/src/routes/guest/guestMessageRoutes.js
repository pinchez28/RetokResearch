import express from 'express';
import { submitGuestContact } from '../../controllers/guest/guestMessagesController.js';

const router = express.Router();

router.post('/contact-admin', submitGuestContact);

export default router;
