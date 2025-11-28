// backend/src/utils/sendEmail.js
// Reusable email helper. Uses environment variables.
// If you already have an email transporter in your project, you can adapt this
// to return transporter.sendMail(...) or import your existing function.

import nodemailer from 'nodemailer';

/**
 * sendEmail({ to, subject, html })
 * - to: string or array of emails
 * - subject: string
 * - html: string (HTML body)
 *
 * This function logs errors instead of throwing so notification flows don't crash.
 */

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Use an existing transporter if you already configured one globally.
    // This code creates one per-call — it's fine for low-volume transactional emails.
    // If your app already has a transporter, replace this block with that transporter.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Academin Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId} -> ${to}`);
    return info;
  } catch (err) {
    // don't throw — log and return null so callers can continue even if email fails
    console.error('sendEmail error:', err?.message || err);
    return null;
  }
};

export default sendEmail;
