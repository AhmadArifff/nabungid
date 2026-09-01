import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.config';
import { env } from '../config/env.config';
import { Result } from '../utils/result.util';
import { Role, UserProfile } from '@nabungid/shared';

export interface RegisterInput {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role?: Role;
  address?: string;
}

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export class AuthService {
  static async register(input: RegisterInput) {
    const { name, phoneNumber, email, password, role = 'NASABAH', address } = input;

    // Guard: Check existing user by phone number
    const existingPhone = await prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (existingPhone) {
      return Result.fail('Nomor telepon/WhatsApp sudah terdaftar.', 409);
    }

    // Guard: Check existing user by email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return Result.fail('Alamat email sudah terdaftar.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        email,
        passwordHash,
        role,
        address,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role as Role,
      avatarUrl: user.avatarUrl || undefined,
      address: user.address || undefined,
    };

    return Result.ok({ user: userProfile, token });
  }

  static async login(input: { phoneNumber?: string; email?: string; identifier?: string; password: string }) {
    const rawIdentifier = input.phoneNumber || input.email || input.identifier;
    if (!rawIdentifier) {
      return Result.fail('Nomor WhatsApp atau email wajib diisi.', 400);
    }

    // Guard: Find user by phone number or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: rawIdentifier }, { email: rawIdentifier }],
      },
    });
    if (!user) {
      return Result.fail('Nomor telepon atau kata sandi tidak sesuai.', 401);
    }

    // Guard: Verify password hash
    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      return Result.fail('Nomor telepon atau kata sandi tidak sesuai.', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role as Role,
      avatarUrl: user.avatarUrl || undefined,
      address: user.address || undefined,
    };

    return Result.ok({ user: userProfile, token });
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Result.fail('Pengguna tidak ditemukan.', 404);
    }

    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role as Role,
      avatarUrl: user.avatarUrl || undefined,
      address: user.address || undefined,
    };

    return Result.ok(userProfile);
  }

  static async updateProfile(userId: string, data: Partial<UserProfile>) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.phoneNumber ? { phoneNumber: data.phoneNumber } : {}),
        ...(data.address ? { address: data.address } : {}),
      },
    });

    const userProfile: UserProfile = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phoneNumber: updated.phoneNumber,
      role: updated.role as Role,
      avatarUrl: updated.avatarUrl || undefined,
      address: updated.address || undefined,
    };

    return Result.ok(userProfile);
  }
}
