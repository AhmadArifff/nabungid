import { Request, Response, NextFunction } from 'express';
import { SystemService } from '../services/system.service';
import { prisma } from '../config/prisma.config';

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
      url.startsWith('/api/v1/system/status')
    ) {
      return next();
    }

    // 2. Always allow all Admin routes (/api/v1/admin/*)
    if (url.startsWith('/api/v1/admin')) {
      return next();
    }

    // 3. Allow Admin login even when maintenance is active
    if (url === '/api/v1/auth/login' && req.method === 'POST') {
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

    // 4. Block all other requests for Nasabah / Public
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
