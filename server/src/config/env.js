import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uiuBot',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change',
  cookieName: process.env.COOKIE_NAME || 'uiu_sid',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  emailFrom: process.env.EMAIL_FROM || 'no-reply@uiubot.local',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  otpExpirySec: Number(process.env.OTP_EXPIRY_SEC || 300),
};

export default env;

