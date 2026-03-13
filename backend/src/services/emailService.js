import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error('❌ SMTP connection failed:', error.message);
  else console.log('✅ Gmail SMTP ready to send emails');
});

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  const mailOptions = {
    from: `"Retok Research Platform" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    replyTo: replyTo || process.env.EMAIL_FROM,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent via Gmail: ${info.messageId}`);
  return info;
};

export default sendEmail;
