import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { pool } from './db.js';
import { sendRegistrationOTPEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || 'evently_super_secure_better_auth_secret_key_2026',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  trustedOrigins: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5000',
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[Better Auth OTP] Sending ${type} OTP to ${email}`);
        if (type === 'email-verification' || type === 'sign-in') {
          await sendRegistrationOTPEmail(email, otp);
        }
      },
    }),
  ],
});

export default auth;
