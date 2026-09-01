import { prisma } from '../config/prisma.config';
import { Result } from '../utils/result.util';
import { calculateEndCyclePayout, DistributionCalculation } from '@nabungid/shared';

export class AdminService {
  /**
   * Get administrative KPI dashboard summary.
   */
  static async getDashboardSummary() {
    const totalNasabah = await prisma.user.count({
      where: { role: 'NASABAH' },
    });

    const verifiedLedgers = await prisma.weeklyLedger.aggregate({
      where: { status: 'VERIFIED' },
      _sum: { amount: true },
    });

    const pendingLedgersCount = await prisma.weeklyLedger.count({
      where: { status: 'WAITING_VERIFICATION' },
    });

    const pendingWithdrawalsCount = await prisma.emergencyWithdrawal.count({
      where: { status: 'PENDING_APPROVAL' },
    });

    const totalKas = Number(verifiedLedgers._sum.amount || 0);

    return Result.ok({
      totalKas,
      totalNasabah,
      pendingLedgersCount,
      pendingWithdrawalsCount,
    });
  }

  /**
   * Get list of weekly ledgers waiting for verification.
   */
  static async getPendingLedgers() {
    const ledgers = await prisma.weeklyLedger.findMany({
      where: { status: 'WAITING_VERIFICATION' },
      include: {
        memberSaving: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { updatedAt: 'asc' },
    });

    const mapped = ledgers.map((l) => ({
      id: l.id,
      weekNumber: l.weekNumber,
      amount: Number(l.amount),
      proofImageUrl: l.proofImageUrl || undefined,
      dueDate: l.dueDate.toISOString(),
      paidDate: l.paidDate ? l.paidDate.toISOString() : undefined,
      userName: l.memberSaving.user.name,
      userPhone: l.memberSaving.user.phoneNumber,
    }));

    return Result.ok(mapped);
  }

  /**
   * Approve or reject a weekly ledger payment.
   */
  static async verifyLedger(
    adminId: string,
    ledgerId: string,
    approve: boolean,
    rejectionReason?: string
  ) {
    const ledger = await prisma.weeklyLedger.findUnique({
      where: { id: ledgerId },
    });

    if (!ledger) {
      return Result.fail('Data setoran tidak ditemukan.', 404);
    }

    const updated = await prisma.weeklyLedger.update({
      where: { id: ledgerId },
      data: {
        status: approve ? 'VERIFIED' : 'REJECTED',
        verifiedById: adminId,
        verifiedAt: new Date(),
        rejectionReason: approve ? null : rejectionReason || 'Bukti transfer tidak valid/jelas.',
      },
    });

    // Create Audit Log
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: approve ? 'VERIFY_PAYMENT_APPROVED' : 'VERIFY_PAYMENT_REJECTED',
        entityName: 'WeeklyLedger',
        entityId: ledgerId,
        newValues: { status: updated.status },
      },
    });

    return Result.ok(updated);
  }

  /**
   * Get list of emergency withdrawals waiting for approval.
   */
  static async getPendingWithdrawals() {
    const withdrawals = await prisma.emergencyWithdrawal.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        user: true,
        memberSaving: {
          include: {
            ledgers: { where: { status: 'VERIFIED' } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const mapped = withdrawals.map((w) => {
      const currentBalance = w.memberSaving.ledgers.reduce((sum, l) => sum + Number(l.amount), 0);
      return {
        id: w.id,
        userName: w.user.name,
        userPhone: w.user.phoneNumber,
        amount: Number(w.amount),
        reason: w.reason,
        currentBalance,
        status: w.status,
        createdAt: w.createdAt.toISOString(),
      };
    });

    return Result.ok(mapped);
  }

  /**
   * Decide on emergency withdrawal (Approve/Reject) with transfer proof.
   */
  static async decideWithdrawal(
    adminId: string,
    withdrawalId: string,
    approve: boolean,
    proofImageUrl?: string,
    rejectionReason?: string
  ) {
    const withdrawal = await prisma.emergencyWithdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return Result.fail('Data pengajuan penarikan darurat tidak ditemukan.', 404);
    }

    const updated = await prisma.emergencyWithdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: approve ? 'COMPLETED' : 'REJECTED',
        approvedById: adminId,
        approvedAt: new Date(),
        proofImageUrl: proofImageUrl || null,
        rejectionReason: approve ? null : rejectionReason || 'Ditolak oleh admin.',
      },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: approve ? 'APPROVE_EMERGENCY_WITHDRAWAL' : 'REJECT_EMERGENCY_WITHDRAWAL',
        entityName: 'EmergencyWithdrawal',
        entityId: withdrawalId,
        newValues: { status: updated.status },
      },
    });

    return Result.ok(updated);
  }

  /**
   * Calculate batch distribution payouts for all active member savings (H-1 Lebaran).
   */
  static async calculateDistributionBatch() {
    const savings = await prisma.memberSaving.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: true,
        program: true,
        bundle: true,
        ledgers: { where: { status: 'VERIFIED' } },
        withdrawals: {
          where: { status: { in: ['APPROVED', 'COMPLETED'] } },
        },
      },
    });

    const results: (DistributionCalculation & {
      memberSavingId: string;
      userName: string;
      userPhone: string;
      bundleName?: string;
    })[] = [];

    for (const s of savings) {
      const totalSavedAmount = s.ledgers.reduce((sum, l) => sum + Number(l.amount), 0);
      const adminFeeAmount = Number(s.program.adminFee);
      const packageGoodsAmount = s.bundle ? Number(s.bundle.bundlePrice) : 0;
      const emergencyDeductionAmount = s.withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);

      const calculation = calculateEndCyclePayout({
        totalSavedAmount,
        adminFeeAmount,
        packageGoodsAmount,
        emergencyDeductionAmount,
      });

      results.push({
        ...calculation,
        memberSavingId: s.id,
        userName: s.user.name,
        userPhone: s.user.phoneNumber,
        bundleName: s.bundle?.name,
      });
    }

    return Result.ok(results);
  }

  /**
   * Get 50-week attendance matrix for all active members in 1 optimized query.
   */
  static async getAttendanceMatrix(cycleId?: string) {
    const savings = await prisma.memberSaving.findMany({
      where: {
        status: 'ACTIVE',
        ...(cycleId ? { cycleId } : {}),
      },
      include: {
        user: true,
        program: true,
        bundle: true,
        ledgers: {
          orderBy: { weekNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const mapped = savings.map((s) => {
      const verifiedCount = s.ledgers.filter((l) => l.status === 'VERIFIED').length;
      const waitingCount = s.ledgers.filter((l) => l.status === 'WAITING_VERIFICATION').length;
      const unpaidCount = 50 - verifiedCount - waitingCount;
      const totalSaved = s.ledgers
        .filter((l) => l.status === 'VERIFIED')
        .reduce((sum, l) => sum + Number(l.amount), 0);

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        phone: s.user.phoneNumber,
        weeklyNominal: Number(s.program.weeklyNominal),
        bundleName: s.bundle?.name || 'Tanpa Paket Barang',
        verifiedCount,
        waitingCount,
        unpaidCount,
        totalSaved,
        streakCount: verifiedCount,
        ledgers: s.ledgers.map((l) => ({
          id: l.id,
          weekNumber: l.weekNumber,
          status: l.status,
          amount: Number(l.amount),
          paidDate: l.paidDate ? l.paidDate.toISOString() : undefined,
          paymentMethod: l.paymentMethod,
          proofImageUrl: l.proofImageUrl || undefined,
        })),
      };
    });

    return Result.ok(mapped);
  }

  /**
   * Quick Cash Entry: Admin marks a week as paid by cash instantly.
   */
  static async quickCashCheckin(adminId: string, memberSavingId: string, weekNumber: number) {
    const ledger = await prisma.weeklyLedger.findFirst({
      where: { memberSavingId, weekNumber },
    });

    if (!ledger) {
      return Result.fail('Data buku kas minggu terkait tidak ditemukan.', 404);
    }

    const updated = await prisma.weeklyLedger.update({
      where: { id: ledger.id },
      data: {
        status: 'VERIFIED',
        paymentMethod: 'CASH',
        paidDate: new Date(),
        verifiedById: adminId,
        verifiedAt: new Date(),
        rejectionReason: null,
      },
    });

    // Audit Log
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action: 'QUICK_CASH_ENTRY',
        entityName: 'WeeklyLedger',
        entityId: ledger.id,
        newValues: { status: 'VERIFIED', paymentMethod: 'CASH', weekNumber },
      },
    });

    return Result.ok(updated);
  }

  /**
   * Generate WhatsApp reminder payload and link for an overdue/unpaid week.
   */
  static async triggerWhatsAppReminder(memberSavingId: string, weekNumber: number) {
    const saving = await prisma.memberSaving.findUnique({
      where: { id: memberSavingId },
      include: { user: true, program: true },
    });

    if (!saving) {
      return Result.fail('Data tabungan nasabah tidak ditemukan.', 404);
    }

    const formattedPhone = saving.user.phoneNumber.startsWith('0')
      ? '62' + saving.user.phoneNumber.slice(1)
      : saving.user.phoneNumber.replace(/[^0-9]/g, '');

    const message = `Assalamu'alaikum Ibu/Bapak ${saving.user.name}, pengingat setoran tabungan Idul Fitri 1447H untuk *Minggu ke-${weekNumber} (Rp ${Number(saving.program.weeklyNominal).toLocaleString('id-ID')})* telah dibuka. Yuk cek-in kartu tabungan Anda di: https://nabungid.com/tabunganku. Terima kasih & semoga berkah! ✨`;

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    return Result.ok({
      userName: saving.user.name,
      userPhone: saving.user.phoneNumber,
      weekNumber,
      message,
      waUrl,
    });
  }
}
