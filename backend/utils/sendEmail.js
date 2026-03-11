import nodemailer from 'nodemailer';

/**
 * sendEmail({ to, subject, html, replyTo })
 * - Works both locally (Gmail) and in production (SendGrid / SMTP)
 */
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    // ---------- Production SMTP ----------
    let transporter;

    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid in production
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey', // literal string required by SendGrid
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      // ---------- Local SMTP (Gmail) ----------
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
        secure: process.env.SMTP_SECURE !== 'false', // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const mailOptions = {
      from: `"Retok Research Platform" <${process.env.SMTP_USER || 'no-reply@example.com'}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId} -> ${to}`);
    return info;
  } catch (err) {
    console.error('❌ sendEmail error:', err?.message || err);
    return null;
  }
};

export default sendEmail;
