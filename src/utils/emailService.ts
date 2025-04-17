// src/utils/emailService.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    secure: false, // Use TLS
    tls: {
      ciphers:'SSLv3'
    }
  });

export const sendWelcomeEmail = async (email: string, password: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome to MissedShots',
    text: `Dear User,

Welcome to MissedShots!

We hope you enjoy using our platform. Here are your account details:
Email: ${email}
Password: ${password}

Best regards,
The MissedShots Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};