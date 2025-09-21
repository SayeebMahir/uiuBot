import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Otp from '../models/Otp.js';
import { env } from '../config/env.js';
import { generateAccessToken } from '../services/token.service.js';
import { generateTotpSecret, verifyTotp, sendEmailOtp } from '../services/otp.service.js';

const registerSchema = z.object({
  email: z.string().email(),
  studentId: z.string().min(6),
  name: z.string().min(2),
  password: z
    .string()
    .min(12)
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[a-z]/, 'Must include lowercase letter')
    .regex(/[0-9]/, 'Must include number')
    .regex(/[^A-Za-z0-9]/, 'Must include special character'),
});

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });
  const { email, studentId, name, password } = parsed.data;

  const exists = await User.findOne({ $or: [{ email }, { studentId }] });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const passwordHash = await User.hashPassword(password);
  const { secret } = generateTotpSecret(email);

  const user = await User.create({ email, studentId, name, passwordHash, twoFactorSecret: secret });
  return res.status(201).json({ message: 'Registered. Please login.' });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });
  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  // Send OTP (email code) as 2FA step
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + env.otpExpirySec * 1000);
  await Otp.create({ userId: user._id, code, purpose: 'login', expiresAt });
  await sendEmailOtp(user.email, code);

  return res.json({ message: 'OTP sent' });
}

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export async function verify2fa(req, res) {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });
  const { email, code } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid request' });

  const otp = await Otp.findOne({ userId: user._id, purpose: 'login' }).sort({ createdAt: -1 });
  if (!otp || otp.consumedAt || otp.expiresAt < new Date() || otp.code !== code) {
    return res.status(401).json({ message: 'Invalid or expired code' });
  }

  otp.consumedAt = new Date();
  await otp.save();

  const refreshTokenId = uuidv4();
  const accessToken = generateAccessToken({ sub: user._id.toString(), email: user.email, rtid: refreshTokenId });

  await Session.create({
    userId: user._id,
    refreshTokenId,
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
    valid: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  res.cookie(env.cookieName, accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15,
  });
  return res.json({ message: 'Logged in' });
}

export async function logout(req, res) {
  res.clearCookie(env.cookieName);
  return res.json({ message: 'Logged out' });
}

