import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// -------------------- CREATE TRANSPORTER --------------------
if (
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS ||
  !process.env.SMTP_HOST
) {
  throw new Error('❌ SMTP_USER, SMTP_PASS, or SMTP_HOST missing in .env');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587, // TLS port
  secure: false, // false for port 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
});

// -------------------- VERIFY SMTP CONNECTION --------------------
transporter.verify((error) => {
  if (error) console.error('❌ SMTP connection failed:', error.message);
  else console.log('✅ Gmail SMTP ready to send emails');
});

// -------------------- SEND EMAIL --------------------
/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 * @param {string} [replyTo] - Optional reply-to email
 */
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const mailOptions = {
      from: `"Retok Research Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent via Gmail: ${info.messageId} -> ${to}`);
    return info;
  } catch (err) {
    console.error('❌ sendEmail error:', err.message);
    throw err;
  }
};

export default sendEmail;
