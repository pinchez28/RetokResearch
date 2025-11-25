// src/controllers/guestRequestController.js
import GuestRequest from '../models/GuestRequest.js';
import nodemailer from 'nodemailer';
import { io } from '../../server.js';

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

// Verify email transporter
transporter.verify((err, success) => {
  if (err) console.error('SMTP Error:', err);
  else console.log('SMTP ready');
});

// ------------------------
// Create a guest request
// ------------------------
export const createGuestRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      topic,
      description,
      phone,
      deadline,
      proposedPrice,
      service,
    } = req.body;

    // Validate required fields (all except proposedPrice)
    if (
      !name ||
      !email ||
      !topic ||
      !description ||
      !phone ||
      !deadline ||
      !service
    ) {
      return res
        .status(400)
        .json({ message: 'All fields except proposedPrice are required' });
    }

    const newRequest = await GuestRequest.create({
      name,
      email,
      topic,
      description,
      phone,
      deadline,
      proposedPrice: proposedPrice || null,
      service,
    });

    // Emit socket event
    io.emit('new-guest-request', newRequest);

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `New Guest Request: ${topic}`,
        text: `New Research Request Received:

Name: ${name}
Email: ${email}
Topic: ${topic}
Service: ${service}
Description: ${description}
Phone: ${phone}
Deadline: ${deadline}
Proposed Price: ${proposedPrice || 'N/A'}
        `,
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Email send failed:', err);
    }

    res
      .status(201)
      .json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating guest request:', error);
    res.status(500).json({ message: 'Server error while creating request' });
  }
};

// ------------------------
// Get all guest requests
// Supports pagination & sorting
// ------------------------
export const getGuestRequests = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await GuestRequest.countDocuments();
    const requests = await GuestRequest.find()
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, requests });
  } catch (error) {
    console.error('Error fetching guest requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// ------------------------
// Update request status
// ------------------------
export const updateGuestRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Seen', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedRequest = await GuestRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    io.emit('guest-request-status-updated', updatedRequest);

    res.json({
      message: 'Status updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// ------------------------
// Delete a guest request
// ------------------------
export const deleteGuestRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GuestRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Notify frontend via socket
    io.emit('guest-request-deleted', { id });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting guest request:', err);
    res.status(500).json({ message: 'Failed to delete request' });
  }
};
