import { app } from './app';
import { env } from './config/env.config';
import { logger } from './utils/logger.util';
import { prisma } from './config/prisma.config';

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

export { server };
