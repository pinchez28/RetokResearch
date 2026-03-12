import nodemailer from 'nodemailer';

let transporter;

// Create transporter once
if (process.env.SENDGRID_API_KEY) {
  console.log('📧 Using SendGrid SMTP');

  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
} else {
  console.log('📧 Using Gmail SMTP');

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

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

    console.log(`✅ Email sent: ${info.messageId} -> ${to}`);

    return info;
  } catch (err) {
    console.error('❌ sendEmail error:', err?.message || err);
    return null;
  }
};

export default sendEmail;
