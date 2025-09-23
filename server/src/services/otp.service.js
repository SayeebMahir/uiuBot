import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import crypto from 'crypto';

// Generate TOTP secret using email as seed
export function generateTotpSecret(email) {
  // Generate a unique secret based on email
  const secret = crypto.createHash('sha256')
    .update(email + env.jwtAccessSecret)
    .digest('hex')
    .slice(0, 32); // Take first 32 chars for consistency

  // Log in development
  if (env.nodeEnv !== 'production') {
    console.log('\x1b[35m%s\x1b[0m', `Generated TOTP secret for ${email}`); // Magenta color
  }

  return { secret };
}

// Custom function to generate 6-digit code
export function myGenerateCode() {
  // Generate a random 6-digit number
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const code = Math.floor(Math.random() * (max - min + 1) + min).toString();

  // Always log in development environment
  if (env.nodeEnv !== 'production') {
    console.log('\x1b[33m%s\x1b[0m', `Generated OTP Code: ${code}`); // Yellow color
  }

  return code;
}

// Verify the code
export function verifyCode(inputCode, storedCode) {
  // Log verification attempt in development
  if (env.nodeEnv !== 'production') {
    console.log(`Verifying OTP - Input: ${inputCode}, Stored: ${storedCode}`);
  }
  return inputCode === storedCode;
}

export async function sendEmailOtp(to, code) {
  // Always log in development environment
  if (env.nodeEnv !== 'production') {
    console.log('\x1b[36m%s\x1b[0m', `OTP sent to ${to}: ${code}`); // Cyan color
  }
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    // fallback: log to console in dev
    // eslint-disable-next-line no-console
    console.log(`OTP for ${to}: ${code}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject: 'Your uiuBot verification code',
    text: `Your verification code is ${code}`,
  });
}

export default { myGenerateCode, verifyCode, sendEmailOtp };

