import GuestRequest from '../../models/guest/GuestRequest.js';
import Notification from '../../models/notification/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

// -------------------- CREATE GUEST REQUEST (Public) --------------------
export const createGuestRequest = async (req, res) => {
  try {
    const { name, email, phone, topic, description, deadline } = req.body;

    // Validate required fields
    if (!name || !email || !topic || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Create request according to schema (guest as an object)
    const request = await GuestRequest.create({
      guest: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || 'N/A',
      },
      topic: topic.trim(),
      description: description.trim(),
      deadline: new Date(deadline),
      status: 'new', // initial status
      progress: 0,
    });

    // Optional: send email to admin
    try {
      await sendEmail({
        to: process.env.SMTP_USER,
        subject: `New Guest Request: ${topic}`,
        html: `
          <h3>New Guest Request Submitted</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Description:</strong><br/>${description}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toDateString()}</p>
        `,
        replyTo: email,
      });
    } catch (emailErr) {
      console.error('Email to admin failed:', emailErr.message);
    }

    // Create admin notification
    try {
      await Notification.create({
        userType: 'Admin',
        title: 'New Guest Request',
        message: `Guest ${name} submitted a request: "${topic}"`,
        jobId: request._id,
      });
    } catch (notifErr) {
      console.error('Notification failed:', notifErr.message);
    }

    // Emit socket event if socket exists
    if (req.app.get('io')) {
      req.app.get('io').to('admins').emit('new-guest-request', request);
    }

    // Respond to guest
    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error('Failed to create guest request:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request',
      error: err.message,
    });
  }
};
