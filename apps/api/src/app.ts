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

import { prisma } from './config/prisma.config';

// 1. Root Landing Manifest Endpoint (Akses https://nabungid-api.vercel.app/)
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'NabungID Backend REST API',
    version: '1.0.0',
    description: 'Platform Tabungan Hari Raya & Paket Lebaran Terintegrasi 50 Minggu Menuju Idul Fitri 1447H',
    status: 'OPERATIONAL',
    environment: env.NODE_ENV,
    author: 'Ahmad Arif',
    license: 'MIT',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      programs: '/api/v1/programs',
      nasabah: '/api/v1/nasabah',
      withdrawals: '/api/v1/withdrawals',
      admin: '/api/v1/admin',
      masterData: '/api/v1/admin/master',
      documentation: 'https://github.com/AhmadArifff/nabungid#readme',
    },
  });
});

// 2. Comprehensive Health Check Endpoint (Akses /health atau /api/v1/health)
app.get(['/health', '/api/health', '/api/v1/health'], async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'UNKNOWN';
  let dbLatencyMs: number | null = null;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = 'CONNECTED';
  } catch (error: any) {
    dbStatus = 'DISCONNECTED';
    logger.error(`Database health check failed: ${error?.message || error}`);
  }

  const memoryUsage = process.memoryUsage();
  const isHealthy = dbStatus === 'CONNECTED';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'HEALTHY' : 'DEGRADED',
    service: 'NabungID Backend REST API',
    version: '1.0.0',
    author: 'Ahmad Arif',
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        pooler: 'Supabase PgBouncer (Port 6543)',
      },
      storage: {
        status: env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY ? 'CONFIGURED' : 'FALLBACK',
        bucketProvider: 'Supabase Storage',
      },
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    },
    responseTimeMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes (dukung baik /api/v1 maupun /v1)
app.use(['/api/v1', '/v1'], rootRouter);

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
