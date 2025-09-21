import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies[env.cookieName];
    if (!token) return res.status(401).json({ message: 'Auth required' });
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

export default requireAuth;

