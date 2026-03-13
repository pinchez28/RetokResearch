// testGmailEmail.js
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// -------------------- Verify ENV --------------------
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'MISSING');

// -------------------- Create Transporter --------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // use TLS for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// -------------------- Verify SMTP Connection --------------------
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
  } else {
    console.log('✅ Gmail SMTP ready to send emails');
  }
});

// -------------------- Send Test Email --------------------
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Retok Research Platform" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to yourself for testing
      subject: '📧 Test Email from Retok Backend',
      html: '<h2>This is a test email using Gmail SMTP!</h2><p>It works!</p>',
    });

    console.log(`✅ Test email sent successfully: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Test email failed:', err.message);
  }
}

sendTestEmail();
