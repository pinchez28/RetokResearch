import GuestMessage from '../../models/guest/guestMessage.js';
import Notification from '../../models/notification/Notification.js';
import { sendEmail } from '../../../utils/sendEmail.js';

export const submitGuestContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const savedMessage = await GuestMessage.create({
      name,
      email,
      phone,
      message,
    });

    // Respond to guest immediately
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });

    // Now do slow async tasks in the background

    // 1️⃣ Email to admin
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Guest Message`,
      html: `
        <h2>New Guest Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p>${message}</p>
      `,
      replyTo: email,
    }).catch((err) => console.error('Admin email failed:', err));

    // 2️⃣ Notification
    Notification.create({
      userType: 'Admin',
      title: 'New Guest Message',
      message: `Guest ${name} wrote a message: "${message}"`,
    }).catch((err) => console.error('Notification failed:', err));

    // 3️⃣ Confirmation email to guest
    sendEmail({
      to: email,
      subject: 'We Received Your Message',
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting us.</p>
        <p>Your message has been received and our admin team will respond shortly.</p>
        <br/>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Best regards,<br/>Admin Team</p>
      `,
    }).catch((err) => console.error('Guest confirmation email failed:', err));
  } catch (error) {
    console.error('Guest contact error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
