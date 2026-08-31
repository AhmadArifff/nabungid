import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phoneNumber: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit')
    .max(15, 'Nomor WhatsApp maksimal 15 digit')
    .regex(/^[0-9+]+$/, 'Nomor WhatsApp hanya boleh angka dan tanda +'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Email atau nomor telepon harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

export const EnrollProgramSchema = z.object({
  programId: z.string().uuid('Program tabungan tidak valid'),
  bundleId: z.string().uuid().optional().nullable(),
  notes: z.string().max(255).optional(),
});

export const EmergencyWithdrawalSchema = z.object({
  memberSavingId: z.string().uuid('ID Tabungan tidak valid'),
  amount: z
    .number()
    .min(50000, 'Minimal penarikan Rp 50.000')
    .max(500000, 'Maksimal penarikan darurat adalah Rp 500.000'),
  reason: z.string().min(5, 'Alasan penarikan minimal 5 karakter'),
});

export const MasterProgramSchema = z.object({
  cycleId: z.string().uuid(),
  name: z.string().min(3, 'Nama program minimal 3 karakter'),
  weeklyNominal: z.number().min(10000, 'Nominal mingguan minimal Rp 10.000'),
  targetWeeks: z.number().min(10).max(60).default(50),
  adminFee: z.number().min(0).default(25000),
  description: z.string().optional(),
});

export const MasterProductItemSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2, 'Nama item minimal 2 karakter'),
  unit: z.string().min(1, 'Satuan harus diisi (e.g. Kg, Pcs, Kaleng)'),
  estimatedPrice: z.number().min(1000, 'Estimasi harga minimal Rp 1.000'),
  imageUrl: z.string().url().optional().nullable(),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export const MasterPackageBundleSchema = z.object({
  name: z.string().min(3, 'Nama paket minimal 3 karakter'),
  description: z.string().optional(),
  bundlePrice: z.number().min(0, 'Harga paket tidak boleh negatif'),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      quantity: z.number().min(1).default(1),
    })
  ),
});
