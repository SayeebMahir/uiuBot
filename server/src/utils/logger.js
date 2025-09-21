import morgan from 'morgan';

// Redact sensitive fields from logs
const redact = (key, value) => {
  const sensitiveKeys = ['password', 'otp', 'token', 'authorization', 'cookie'];
  if (sensitiveKeys.includes(String(key).toLowerCase())) {
    return '[REDACTED]';
  }
  return value;
};

export const httpLogger = morgan('combined', {
  stream: {
    write: (msg) => {
      try {
        // Could extend to write to file if needed
        process.stdout.write(msg);
      } catch (_) {
        // noop
      }
    },
  },
});

export function safeStringify(object) {
  try {
    return JSON.stringify(object, redact);
  } catch {
    return '[unserializable]';
  }
}

export default httpLogger;

