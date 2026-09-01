import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';
import { calculateEndCyclePayout, WeeklyLedgerItem } from '@nabungid/shared';

export class NasabahService {
  /**
   * Enroll a nasabah into a savings program and generate 50 weekly ledgers.
   */
  static async enrollProgram(userId: string, programId: string, bundleId?: string) {
    // Guard: Verify program exists
    const program = await prisma.savingsProgram.findUnique({
      where: { id: programId },
      include: { cycle: true },
    });

    if (!program || !program.isActive) {
      return Result.fail('Program tabungan tidak ditemukan atau sudah tidak aktif.', 404);
    }

    // Guard: Check if user already enrolled in this cycle
    const existing = await prisma.memberSaving.findUnique({
      where: {
        userId_cycleId_programId: {
          userId,
          cycleId: program.cycleId,
          programId: program.id,
        },
      },
    });

    if (existing) {
      return Result.fail('Anda sudah terdaftar pada program tabungan ini.', 409);
    }

    // Create MemberSaving
    const memberSaving = await prisma.memberSaving.create({
      data: {
        userId,
        cycleId: program.cycleId,
        programId: program.id,
        bundleId: bundleId || null,
        status: 'ACTIVE',
      },
    });

    // Generate 50 weekly ledger records
    const startDate = new Date(program.cycle.startDate);
    const ledgersData = [];

    for (let w = 1; w <= program.targetWeeks; w++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(startDate.getDate() + (w - 1) * 7);

      ledgersData.push({
        memberSavingId: memberSaving.id,
        weekNumber: w,
        dueDate,
        amount: program.weeklyNominal,
        status: 'PENDING_PAYMENT' as const,
      });
    }

    await prisma.weeklyLedger.createMany({
      data: ledgersData,
    });

    return Result.ok(memberSaving);
  }

  /**
   * Get active member saving details for current user.
   */
  static async getMySavings(userId: string) {
    const savings = await prisma.memberSaving.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        program: true,
        bundle: true,
        cycle: true,
        ledgers: {
          orderBy: { weekNumber: 'asc' },
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!savings) {
      return Result.fail('Belum ada program tabungan aktif untuk akun Anda.', 404);
    }

    const mappedLedgers: WeeklyLedgerItem[] = savings.ledgers.map((l) => ({
      id: l.id,
      memberSavingId: l.memberSavingId,
      weekNumber: l.weekNumber,
      dueDate: l.dueDate.toISOString(),
      amount: Number(l.amount),
      status: l.status as any,
      paymentMethod: l.paymentMethod as any,
      proofImageUrl: l.proofImageUrl || undefined,
      verifiedAt: l.verifiedAt ? l.verifiedAt.toISOString() : undefined,
    }));

    // Calculate totals
    const verifiedWeeks = savings.ledgers.filter((l) => l.status === 'VERIFIED');
    const totalSavedAmount = verifiedWeeks.reduce((sum, l) => sum + Number(l.amount), 0);
    const adminFeeAmount = Number(savings.program.adminFee);
    const packageGoodsAmount = savings.bundle ? Number(savings.bundle.bundlePrice) : 0;
    const emergencyDeductionAmount = savings.withdrawals
      .filter((w) => w.status === 'APPROVED' || w.status === 'COMPLETED')
      .reduce((sum, w) => sum + Number(w.amount), 0);

    const payout = calculateEndCyclePayout({
      totalSavedAmount,
      adminFeeAmount,
      packageGoodsAmount,
      emergencyDeductionAmount,
    });

    return Result.ok({
      id: savings.id,
      program: {
        id: savings.program.id,
        name: savings.program.name,
        weeklyNominal: Number(savings.program.weeklyNominal),
        targetWeeks: savings.program.targetWeeks,
        adminFee: Number(savings.program.adminFee),
      },
      bundle: savings.bundle
        ? {
            id: savings.bundle.id,
            name: savings.bundle.name,
            bundlePrice: Number(savings.bundle.bundlePrice),
            description: savings.bundle.description || undefined,
            imageUrl: savings.bundle.imageUrl || undefined,
          }
        : null,
      ledgers: mappedLedgers,
      withdrawals: savings.withdrawals.map((w) => ({
        id: w.id,
        amount: Number(w.amount),
        reason: w.reason,
        status: w.status,
        createdAt: w.createdAt.toISOString(),
      })),
      payoutSummary: payout,
    });
  }

  /**
   * Submit payment proof for a specific week number.
   */
  static async submitPaymentProof(
    userId: string,
    savingId: string,
    weekNumber: number,
    proofImageUrl: string
  ) {
    // Guard: Verify ownership
    const saving = await prisma.memberSaving.findFirst({
      where: { id: savingId, userId },
    });

    if (!saving) {
      return Result.fail('Data tabungan tidak ditemukan atau bukan milik Anda.', 403);
    }

    const ledger = await prisma.weeklyLedger.findUnique({
      where: {
        memberSavingId_weekNumber: {
          memberSavingId: savingId,
          weekNumber,
        },
      },
    });

    if (!ledger) {
      return Result.fail(`Data setoran minggu ke-${weekNumber} tidak ditemukan.`, 404);
    }

    if (ledger.status === 'VERIFIED') {
      return Result.fail(`Setoran minggu ke-${weekNumber} sudah diverifikasi lunas.`, 400);
    }

    const updated = await prisma.weeklyLedger.update({
      where: { id: ledger.id },
      data: {
        proofImageUrl,
        status: 'WAITING_VERIFICATION',
        paidDate: new Date(),
      },
    });

    return Result.ok(updated);
  }

  /**
   * Select or change package bundle for active savings.
   */
  static async selectBundle(userId: string, savingId: string, bundleId: string | null) {
    const saving = await prisma.memberSaving.findFirst({
      where: { id: savingId, userId },
    });

    if (!saving) {
      return Result.fail('Data tabungan tidak ditemukan.', 404);
    }

    const updated = await prisma.memberSaving.update({
      where: { id: savingId },
      data: { bundleId },
    });

    return Result.ok(updated);
  }

  /**
   * Get digital receipt payload for a verified weekly payment.
   */
  static async getDigitalReceipt(userId: string, savingId: string, weekNumber: number) {
    const saving = await prisma.memberSaving.findFirst({
      where: { id: savingId, userId },
      include: {
        user: true,
        program: true,
        ledgers: {
          where: { weekNumber },
        },
      },
    });

    if (!saving || saving.ledgers.length === 0) {
      return Result.fail('Data setoran tidak ditemukan.', 404);
    }

    const ledger = saving.ledgers[0];
    if (ledger.status !== 'VERIFIED') {
      return Result.fail('Kwitansi hanya tersedia untuk setoran yang telah diverifikasi lunas.', 400);
    }

    return Result.ok({
      receiptNumber: `KW-1447-W${weekNumber.toString().padStart(2, '0')}-${ledger.id.slice(-4).toUpperCase()}`,
      userName: saving.user.name,
      userPhone: saving.user.phoneNumber,
      weekNumber: ledger.weekNumber,
      amount: Number(ledger.amount),
      paymentMethod: ledger.paymentMethod,
      paidDate: ledger.paidDate ? ledger.paidDate.toISOString() : new Date().toISOString(),
      verifiedAt: ledger.verifiedAt ? ledger.verifiedAt.toISOString() : undefined,
      programName: saving.program.name,
      isVerified: true,
    });
  }
}
