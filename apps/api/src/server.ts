import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.config';
import { logger } from './utils/logger.util';
import rootRouter from './routes';
import { globalErrorHandler } from './middleware/error.middleware';
import { prisma } from './config/prisma.config';

const app = express();

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

// Request logging with Morgan
const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

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

// Start server
const server = app.listen(env.PORT, () => {
  logger.info(`✨ NabungID Backend REST API is running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`👉 API Endpoint: http://localhost:${env.PORT}/api/v1`);
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`[${signal}] Received. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
