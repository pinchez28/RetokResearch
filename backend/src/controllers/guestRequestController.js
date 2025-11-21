import GuestRequest from '../models/GuestRequest.js';
import nodemailer from 'nodemailer';

// Configure email (example with Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL, // admin email
    pass: process.env.EMAIL_PASSWORD, // app password or SMTP password
  },
});

// Create a guest request
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

    if (!email || !topic || !description) {
      return res
        .status(400)
        .json({ message: 'Email, topic, and description are required' });
    }

    const newRequest = await GuestRequest.create({
      name,
      email,
      topic,
      description,
      phone,
      deadline,
      proposedPrice,
      service,
    });

    // Send email to admin
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Guest Research Request: ${topic}`,
      html: `
        <h2>New Research Request</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Service:</strong> ${service || 'Quick Request'}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Deadline:</strong> ${deadline || 'N/A'}</p>
        <p><strong>Proposed Price:</strong> ${proposedPrice || 'N/A'}</p>
      `,
    });

    res
      .status(201)
      .json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating guest request:', error);
    res.status(500).json({ message: 'Server error while creating request' });
  }
};

// Admin: fetch all guest requests
export const getGuestRequests = async (req, res) => {
  try {
    const requests = await GuestRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};
