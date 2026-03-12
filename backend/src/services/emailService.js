// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

// ⚡ Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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

/* =====================================================
   AUTH EMAIL HELPERS
   ===================================================== */

/**
 * Send email verification link
 */
export async function sendVerificationEmail(userEmail, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const subject = 'Verify your email';
  const text = `Click the link to verify your email: ${verificationUrl}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please verify your email by clicking the button below:</p>
    <a href="${verificationUrl}" 
       style="padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
       Verify Email
    </a>
  `;

  return sendEmail(userEmail, subject, text, html);
}

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(userEmail, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const subject = 'Reset your password';
  const text = `Reset your password using this link: ${resetUrl}`;

  const html = `
    <h2>Password Reset</h2>
    <p>You requested a password reset.</p>
    <a href="${resetUrl}" 
       style="padding:10px 20px;background:#dc2626;color:white;text-decoration:none;border-radius:6px;">
       Reset Password
    </a>
  `;

  return sendEmail(userEmail, subject, text, html);
}
