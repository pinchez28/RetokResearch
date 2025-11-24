// src/controllers/contactController.js
import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';
import { io } from '../../server.js'; // if you want real-time notifications

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter
transporter.verify((err, success) => {
  if (err) console.error('SMTP Error:', err);
  else console.log('SMTP ready for Contact Messages');
});

// ------------------------
// Submit a new contact message
// ------------------------
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Name, email, and message are required.' });
    }

    const newMessage = await ContactMessage.create({ name, email, message });

    // Emit socket event (optional)
    io.emit('new-contact-message', newMessage);

    // Send email to admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        text: `You received a new contact message:

Name: ${name}
Email: ${email}
Message: ${message}`,
      });
      console.log('Admin notified via email');
    } catch (err) {
      console.error('Failed to send admin email:', err);
    }

    res
      .status(201)
      .json({ message: 'Message sent successfully', data: newMessage });
  } catch (err) {
    console.error('Error creating contact message:', err);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// ------------------------
// Get all contact messages (for admin)
// ------------------------
export const getContactMessages = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await ContactMessage.countDocuments();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, messages });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// ------------------------
// Update message status
// ------------------------
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Seen', 'Responded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });

    io.emit('contact-message-status-updated', updated);
    res.json({ message: 'Status updated', data: updated });
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// ------------------------
// Delete a contact message
// ------------------------
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });

    io.emit('contact-message-deleted', { id });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
