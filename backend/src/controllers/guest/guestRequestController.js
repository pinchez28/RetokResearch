import GuestRequest from '../../models/guest/GuestRequest.js';
import nodemailer from 'nodemailer';

// Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Create Guest Request
export const createGuestRequest = async (req, res) => {
  try {
    // 1️⃣ Save request in DB
    const request = await GuestRequest.create(req.body);

    // 2️⃣ Send email to admin
    await transporter.sendMail({
      from: req.body.email,
      to: process.env.SMTP_USER, // admin receives the email here
      subject: `New Guest Research Request: ${req.body.name}`,
      html: `
        <h3>New Guest Request Submitted</h3>
        <p><strong>Name:</strong> ${req.body.name}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.phone || 'N/A'}</p>
        <p><strong>Service:</strong> ${req.body.service || 'Quick Request'}</p>
        <p><strong>Topic:</strong> ${req.body.topic}</p>
        <p><strong>Description:</strong><br/>${req.body.description}</p>
        <p><strong>Deadline:</strong> ${req.body.deadline || 'N/A'}</p>
        <p><strong>Proposed Price:</strong> ${
          req.body.proposedPrice || 'N/A'
        }</p>
      `,
    });

    // 3️⃣ Emit real-time notification via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('new-guest-request', request);
    }

    // 4️⃣ Respond to client
    res.status(201).json(request);
  } catch (err) {
    console.error('Failed to create guest request:', err);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

// Get Guest Requests (with pagination)
export const getGuestRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await GuestRequest.countDocuments();
    const requests = await GuestRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ total, requests });
  } catch (err) {
    console.error('Failed to fetch guest requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Delete Guest Request
export const deleteGuestRequest = async (req, res) => {
  try {
    await GuestRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Guest request deleted successfully' });
  } catch (err) {
    console.error('Failed to delete guest request:', err);
    res.status(500).json({ message: 'Failed to delete request' });
  }
};
