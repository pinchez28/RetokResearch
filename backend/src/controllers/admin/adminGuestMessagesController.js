import GuestMessage from '../../models/guest/guestMessage.js';
import { sendEmail } from '../../../utils/sendEmail.js';

// GET all messages
export const getAllGuestMessages = async (req, res) => {
  try {
    const messages = await GuestMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, total: messages.length, messages });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch messages' });
  }
};

// GET single message
export const getGuestMessageById = async (req, res) => {
  try {
    const message = await GuestMessage.findById(req.params.id);
    if (!message)
      return res
        .status(404)
        .json({ success: false, message: 'Message not found' });

    res.json({ success: true, message });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch message' });
  }
};

// MARK as replied & send feedback
export const markMessageReplied = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
    }

    const message = await GuestMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // 🔥 Save reply in DB
    message.reply = reply;
    message.status = 'replied';
    message.repliedAt = new Date();
    await message.save();

    // ✅ Respond to admin immediately
    res.json({
      success: true,
      message: 'Message marked as replied. Guest will be notified shortly.',
    });

    // 🔥 Send reply email asynchronously (in background)
    (async () => {
      try {
        await sendEmail({
          to: message.email,
          subject: 'Reply from Admin',
          html: `
            <h2>Hello ${message.name},</h2>
            <p>Thank you for contacting us.</p>
            <p>Here is our response:</p>
            <blockquote style="background:#f4f4f4;padding:10px;border-left:4px solid #000;">
              ${reply}
            </blockquote>
            <br/>
            <p>Best regards,</p>
            <p><strong>Admin Team</strong></p>
          `,
        });
      } catch (err) {
        console.error('Failed to send reply email:', err);
      }
    })();
  } catch (err) {
    console.error(err);

    // Only send error if headers have not already been sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark as replied',
      });
    }
  }
};

// DELETE a message
export const deleteGuestMessage = async (req, res) => {
  try {
    const message = await GuestMessage.findByIdAndDelete(req.params.id);
    if (!message)
      return res
        .status(404)
        .json({ success: false, message: 'Message not found' });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete message' });
  }
};
