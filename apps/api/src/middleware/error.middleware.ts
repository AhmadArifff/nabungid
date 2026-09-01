import { Request, Response, NextFunction } from 'express';
import { DomainException } from '../exceptions/domain.exception';
import { logger } from '../utils/logger.util';
import { env } from '../config/env.config';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Domain / Business exceptions
  if (err instanceof DomainException) {
    logger.warn(`[DomainException] ${req.method} ${req.originalUrl} - ${err.message}`, {
      statusCode: err.statusCode,
      details: err.details,
      ip: req.ip,
      userId: (req as any).user?.id,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null,
    });
    return;
  }

  // Unhandled / Internal Server Error
  logger.error(`[UnhandledException] ${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: err.stack,
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal pada server.',
    ...(env.NODE_ENV === 'development' ? { debugError: err.message, stack: err.stack } : {}),
  });
};
