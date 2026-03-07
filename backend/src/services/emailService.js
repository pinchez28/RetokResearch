// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

// ⚡ Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // email password / app password
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} [html] - Optional HTML body
 */
export async function sendEmail(to, subject, text, html = null) {
  if (!to || !subject || !text) {
    throw new Error('Email to, subject, and text are required');
  }

  const mailOptions = {
    from: `"Academin Research Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Email sending failed:', err.message);
    throw err;
  }
}
