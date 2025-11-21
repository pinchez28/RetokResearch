import GuestSubmission from '../models/GuestSubmission.js';
import { io } from '../../server.js'; // Make sure the path is correct
import sendEmail from '../utils/sendEmail.js'; // We'll create this utility

/**
 * @desc   Create guest submission
 * @route  POST /api/guest-submissions
 * @access Public
 */
export const createGuestSubmission = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const submission = new GuestSubmission({ name, email, service, message });
    const saved = await submission.save();

    // 1️⃣ Emit to all connected admins via Socket.IO
    io.emit('new-guest-submission', saved);

    // 2️⃣ Send email notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Guest Submission: ${service}`,
      text: `You have received a new guest submission.

Name: ${name}
Email: ${email}
Service: ${service}
Message: ${message}

Check your admin dashboard for details.`,
    });

    res.status(201).json({ message: 'Submission received', submission: saved });
  } catch (error) {
    console.error('Error creating guest submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc   Get all guest submissions
 * @route  GET /api/guest-submissions
 * @access Admin
 */
export const getAllGuestSubmissions = async (req, res) => {
  try {
    const submissions = await GuestSubmission.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching guest submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
