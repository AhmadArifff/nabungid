import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';
import {
  InsufficientBalanceException,
  QuotaExceededException,
  BusinessRuleException,
} from '../exceptions/domain.exception';

export class WithdrawalService {
  /**
   * Request emergency withdrawal with strict business rule guards (PRD 4.3).
   */
  static async requestWithdrawal(userId: string, memberSavingId: string, amount: number, reason: string) {
    // Guard 1: Validate positive nominal
    if (amount <= 0) {
      return Result.fail('Nominal penarikan darurat harus lebih dari Rp 0.', 400);
    }

    // Guard 2: Strict limit max Rp 500.000
    if (amount > 500000) {
      return Result.fail(
        'Nominal melebihi batas maksimal penarikan darurat (Maks Rp 500.000).',
        400
      );
    }

    // Guard 3: Minimum reason length
    if (!reason || reason.trim().length < 5) {
      return Result.fail('Alasan penarikan darurat wajib diisi minimal 5 karakter.', 400);
    }

    // Find member saving record with relations
    const memberSaving = await prisma.memberSaving.findFirst({
      where: { id: memberSavingId, userId, status: 'ACTIVE' },
      include: {
        program: true,
        ledgers: {
          where: { status: 'VERIFIED' },
        },
        withdrawals: true,
      },
    });

    if (!memberSaving) {
      return Result.fail('Data tabungan aktif tidak ditemukan.', 404);
    }

    // Guard 4: Frequency limit (Max 1x per cycle)
    const existingWithdrawals = memberSaving.withdrawals.filter(
      (w) => w.status === 'PENDING_APPROVAL' || w.status === 'APPROVED' || w.status === 'COMPLETED'
    );

    if (existingWithdrawals.length > 0) {
      return Result.fail(
        'Batas frekuensi penarikan darurat (1x penarikan per siklus tabungan) telah tercapai.',
        400
      );
    }

    // Guard 5: Safe balance check (verifiedBalance >= amount + adminFee)
    const verifiedBalance = memberSaving.ledgers.reduce((sum, l) => sum + Number(l.amount), 0);
    const adminFee = Number(memberSaving.program.adminFee);

    if (verifiedBalance < amount + adminFee) {
      return Result.fail(
        `Saldo tabungan terverifikasi saat ini (Rp ${verifiedBalance.toLocaleString(
          'id-ID'
        )}) tidak mencukupi untuk penarikan Rp ${amount.toLocaleString('id-ID')} + Biaya Admin.`,
        400
      );
    }

    // Create withdrawal request record
    const withdrawal = await prisma.emergencyWithdrawal.create({
      data: {
        memberSavingId,
        userId,
        amount,
        reason,
        status: 'PENDING_APPROVAL',
      },
    });

    return Result.ok(withdrawal);
  }

  /**
   * Get withdrawal quota and status for user.
   */
  static async getWithdrawalStatus(userId: string) {
    const withdrawals = await prisma.emergencyWithdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const quotaUsed = withdrawals.some(
      (w) => w.status === 'PENDING_APPROVAL' || w.status === 'APPROVED' || w.status === 'COMPLETED'
    );

    const totalApproved = withdrawals
      .filter((w) => w.status === 'APPROVED' || w.status === 'COMPLETED')
      .reduce((sum, w) => sum + Number(w.amount), 0);

    return Result.ok({
      quotaUsed,
      totalApproved,
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        memberSavingId: w.memberSavingId,
        amount: Number(w.amount),
        reason: w.reason,
        status: w.status,
        proofImageUrl: w.proofImageUrl || undefined,
        createdAt: w.createdAt.toISOString(),
      })),
    });
  }
}
