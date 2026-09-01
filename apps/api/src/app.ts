import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.config';
import { logger } from './utils/logger.util';
import rootRouter from './routes';
import { globalErrorHandler } from './middleware/error.middleware';

export const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging with Morgan in non-test env
if (process.env.NODE_ENV !== 'test') {
  const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api/v1', rootRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute API '${req.method} ${req.originalUrl}' tidak ditemukan.`,
  });
});

// Centralized Global Error Handler
app.use(globalErrorHandler);

export default app;
