import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Session from '../models/Session.js';
import Otp from '../models/Otp.js';
import { env } from '../config/env.js';
import { generateAccessToken } from '../services/token.service.js';
import { myGenerateCode, verifyCode, sendEmailOtp, generateTotpSecret } from '../services/otp.service.js';

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
  try {
    console.log('Registration request received:', req.body);
    
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation failed:', parsed.error);
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }
    
    const { email, studentId, name, password } = parsed.data;
    console.log('Parsed registration data:', { email, studentId, name });

    const exists = await User.findOne({ $or: [{ email }, { studentId }] });
    if (exists) {
      console.log('User already exists with email or studentId');
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await User.hashPassword(password);
    const { secret } = generateTotpSecret(email);

    console.log('Creating new user...');
    const user = await User.create({ email, studentId, name, passwordHash, twoFactorSecret: secret });
    console.log('User created successfully:', user._id);
    
    return res.status(201).json({ message: 'Registered. Please login.' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
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

  // Generate and send OTP using our custom function
  const code = myGenerateCode();
  const expiresAt = new Date(Date.now() + env.otpExpirySec * 1000);
  await Otp.create({ userId: user._id, code, purpose: 'login', expiresAt });
  await sendEmailOtp(user.email, code);

  // Log in development environment
  if (env.nodeEnv !== 'production') {
    console.log('\x1b[32m%s\x1b[0m', `Login attempt for ${email} - OTP generated and sent`); // Green color
  }

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
  if (!otp || otp.consumedAt || otp.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Invalid or expired code' });
  }

  // Use our custom verification function
  if (!verifyCode(code, otp.code)) {
    return res.status(401).json({ message: 'Invalid code' });
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

