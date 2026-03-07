import AdminService from '../../models/admin/Service.js';
import Notification from '../../models/notification/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

// -------------------- PUBLIC: GET ALL SERVICES --------------------
export const getServices = async (req, res) => {
  try {
    const services = await AdminService.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (err) {
    console.error('Failed to fetch services:', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch services' });
  }
};

// -------------------- GUEST: REQUEST A SERVICE --------------------
export const requestService = async (req, res) => {
  const { name, email, phone, serviceId, message } = req.body;

  if (!name || !email || !serviceId || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, service ID, and message are required',
    });
  }

  try {
    // Optional: store guest request somewhere for analytics
    const guestRequest = {
      name,
      email,
      phone,
      serviceId,
      message,
      createdAt: new Date(),
    };

    // Send email to admin
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `New Guest Service Request`,
      html: `
        <h3>New Guest Service Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service ID:</strong> ${serviceId}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
      replyTo: email,
    });

    // Notify admin
    await Notification.create({
      userType: 'Admin',
      title: 'New Guest Service Request',
      message: `Guest ${name} requested service ID ${serviceId}`,
    });

    // Emit socket event if available
    if (req.app.get('io')) {
      req.app.get('io').to('admins').emit('new-guest-service', guestRequest);
    }

    res.status(201).json({ success: true, guestRequest });
  } catch (err) {
    console.error('Failed to create guest service request:', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to submit request' });
  }
};
