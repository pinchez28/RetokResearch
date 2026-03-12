// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

/* =====================================================
   SMTP TRANSPORTER
   ===================================================== */

const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
  } else {
    console.log('✅ SMTP server ready to send emails');
  }
});

/* =====================================================
   GENERIC EMAIL SENDER
   ===================================================== */

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} [html] - Optional HTML body
 */
export async function sendEmail(to, subject, text, html = null) {
  if (!to || !subject || !text) {
    throw new Error("Email 'to', 'subject', and 'text' are required");
  }

  const mailOptions = {
    from: `"Retok Research Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent to ${to}:`, info.messageId);

    return info;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
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
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is not defined in environment variables');
  }

  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

  const subject = 'Verify your email';

  const text = `Click the link to verify your email:\n${verificationUrl}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Please verify your email by clicking the button below:</p>

    <a href="${verificationUrl}"
       style="padding:12px 20px;background:#2563eb;color:white;
       text-decoration:none;border-radius:6px;font-weight:bold;">
       Verify Email
    </a>

    <p style="margin-top:20px;">
      If the button does not work, copy and paste this link:
    </p>

    <p>${verificationUrl}</p>
  `;

  return sendEmail(userEmail, subject, text, html);
}

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(userEmail, token) {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is not defined in environment variables');
  }

  const resetUrl = `${frontendUrl}/reset-password/${token}`;

  const subject = 'Reset your password';

  const text = `Reset your password using this link:\n${resetUrl}`;

  const html = `
    <h2>Password Reset</h2>

    <p>You requested a password reset.</p>

    <a href="${resetUrl}"
       style="padding:12px 20px;background:#dc2626;color:white;
       text-decoration:none;border-radius:6px;font-weight:bold;">
       Reset Password
    </a>

    <p style="margin-top:20px;">
      If the button does not work, copy this link:
    </p>

    <p>${resetUrl}</p>
  `;

  return sendEmail(userEmail, subject, text, html);
}
