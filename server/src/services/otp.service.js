import nodemailer from 'nodemailer';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { env } from '../config/env.js';

export function generateTotpSecret(label) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(label, 'uiuBot', secret);
  return { secret, otpauth };
}

export async function generateTotpQrDataUrl(otpauth) {
  return QRCode.toDataURL(otpauth);
}

export function verifyTotp(token, secret) {
  return authenticator.verify({ token, secret });
}

export async function sendEmailOtp(to, code) {
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

export default { generateTotpSecret, generateTotpQrDataUrl, verifyTotp, sendEmailOtp };

