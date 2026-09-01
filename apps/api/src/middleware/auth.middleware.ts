import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { UnauthorizedException, ForbiddenException } from '../exceptions/domain.exception';
import { Role } from '@nabungid/shared';

export interface JwtPayload {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Guard: Check header existence and format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token autentikasi tidak ditemukan.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Sesi login telah kedaluwarsa. Silakan masuk kembali.');
    }
    throw new UnauthorizedException('Token autentikasi tidak valid.');
  }
};

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Guard: User must be authenticated
    if (!req.user) {
      throw new UnauthorizedException('Autentikasi diperlukan.');
    }

    // Guard: Role authorization check
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException(
        `Akses ditolak. Endpoint ini memerlukan peran: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};
