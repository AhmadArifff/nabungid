import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SystemService } from '../services/system.service';
import { prisma } from '../config/prisma.config';
import { env } from '../config/env.config';
import { JwtPayload } from './auth.middleware';

export const checkMaintenanceMode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await SystemService.getMaintenanceConfig();

    // If maintenance mode is OFF, pass through immediately
    if (!config.isMaintenance) {
      return next();
    }

    const url = req.originalUrl || req.url;

    // 1. Always allow health checks, manifest, and system status
    if (
      url === '/' ||
      url === '/api' ||
      url.startsWith('/health') ||
      url.startsWith('/api/health') ||
      url.startsWith('/api/v1/health') ||
      url.startsWith('/v1/health') ||
      url.startsWith('/api/v1/system/status') ||
      url.startsWith('/v1/system/status') ||
      url.startsWith('/system/status')
    ) {
      return next();
    }

    // 2. Token-based Admin Immunity: If request has valid ADMIN JWT token, bypass maintenance completely across ALL endpoints
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        if (decoded && decoded.role === 'ADMIN') {
          req.user = decoded;
          return next();
        }
      } catch {
        // Token invalid or expired, proceed to standard checks
      }
    }

    // 3. Path-based Admin routes immunity (supports /api/v1/admin, /v1/admin, /admin)
    if (
      url.startsWith('/api/v1/admin') ||
      url.startsWith('/v1/admin') ||
      url.startsWith('/admin')
    ) {
      return next();
    }

    // 4. Allow Admin login even when maintenance is active
    const isLoginEndpoint =
      url.includes('/auth/login') ||
      url === '/api/v1/auth/login' ||
      url === '/v1/auth/login' ||
      url === '/auth/login';

    if (isLoginEndpoint && req.method === 'POST') {
      const identifier = (req.body?.identifier || req.body?.phoneNumber || req.body?.email || '').trim();
      if (identifier) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: 'insensitive' } },
              { phoneNumber: identifier },
              { name: { equals: identifier, mode: 'insensitive' } },
            ],
          },
          select: { role: true },
        });

        // If it's an admin, let them authenticate
        if (user?.role === 'ADMIN') {
          return next();
        }
      }
    }

    // 5. Block all other requests for Nasabah / Public
    res.status(503).json({
      success: false,
      maintenance: true,
      message: config.message || 'Sistem NabungID sedang dalam pemeliharaan berkala (Maintenance Mode).',
      details: {
        estimatedEndTime: config.estimatedEndTime || null,
        contactWhatsapp: config.contactWhatsapp || '089988776655',
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    // If checking maintenance fails, fail open to avoid total breakdown
    console.error('[MaintenanceMiddlewareError]:', error);
    next();
  }
};
