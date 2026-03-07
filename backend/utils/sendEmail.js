import nodemailer from 'nodemailer';

/**
 * sendEmail({ to, subject, html, replyTo })
 * - to: string or array of emails
 * - subject: email subject
 * - html: HTML body of the email
 * - replyTo: optional, sets who replies go to
 */
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
      secure: true, // Gmail App Passwords require secure connection on 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Academin Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER, // optional: guest email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId} -> ${to}`);
    return info;
  } catch (err) {
    console.error('sendEmail error:', err?.message || err);
    return null; // don’t throw, allow app flow to continue
  }
};

export default sendEmail;
