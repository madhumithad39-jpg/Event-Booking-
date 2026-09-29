import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

export const getMailerTransporter = async () => {
  if (transporter) return transporter;

  const hasCredentials = process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_HOST;

  if (hasCredentials && !process.env.SMTP_USER.includes('placeholder')) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      await transporter.verify();
      console.log('[SMTP] Transporter verified and connected to', process.env.SMTP_HOST);
    } catch (err) {
      console.warn('[SMTP] Verification failed with provided credentials:', err.message);
      console.warn('[SMTP] Falling back to test transporter for uninterrupted local operation.');
      transporter = null;
    }
  }

  if (!transporter) {
    // Development fallback using Ethereal test account or console logging
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('[SMTP] Development Ethereal account initialized for local testing.');
    } catch (err) {
      console.warn('[SMTP] Could not create Ethereal account, using console preview transport.');
      // Stream/json transport fallback that logs to stdout
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  return transporter;
};

export const getFromAddress = () => {
  return process.env.SMTP_FROM || '"EVENTLY Platform" <noreply@evently.com>';
};

export default {
  getMailerTransporter,
  getFromAddress,
};
