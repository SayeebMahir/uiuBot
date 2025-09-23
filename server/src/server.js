import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import { env } from './config/env.js';
import { httpLogger } from './utils/logger.js';
import connectToDatabase from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

app.use(helmet());
app.use(httpLogger);
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');

// Serve static files from public directory
app.use('/static', express.static('public'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

async function start() {
  try {
    await connectToDatabase();
    const server = app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const alternatePort = env.port + 1;
        console.log(`Port ${env.port} is in use, trying port ${alternatePort}`);
        server.listen(alternatePort);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

