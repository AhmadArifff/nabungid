import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phoneNumber: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit')
    .max(14, 'Nomor WhatsApp maksimal 14 digit')
    .regex(/^08[0-9]{8,12}$/, 'Nomor WhatsApp harus diawali 08 dan terdiri dari 10-14 digit angka murni'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  selectedNominal: z.number().optional(),
});

export const LoginSchema = z.object({
  identifier: z.string().min(2, 'Username, email atau nomor WhatsApp harus diisi'),
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

export const PaymentProofUploadSchema = z.object({
  weekNumber: z.number().min(1).max(60),
  proofImageUrl: z.string().min(1, 'Foto bukti transfer harus disertakan'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  address: z.string().optional(),
});

// CamelCase aliases
export const registerSchema = RegisterSchema;
export const loginSchema = LoginSchema;
export const updateProfileSchema = UpdateProfileSchema;
export const enrollProgramSchema = EnrollProgramSchema;
export const emergencyWithdrawalRequestSchema = EmergencyWithdrawalSchema;
export const paymentProofUploadSchema = PaymentProofUploadSchema;

