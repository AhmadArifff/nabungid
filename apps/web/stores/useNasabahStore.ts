'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WeeklyLedgerItem,
  PackageBundle,
  SavingsProgram,
  EmergencyWithdrawalRequest,
  calculateEndCyclePayout,
  validateEmergencyWithdrawal,
} from '@nabungid/shared';

// Initial 50-week ledger generator
const generateInitialLedgers = (weeklyAmount = 100000): WeeklyLedgerItem[] => {
  const ledgers: WeeklyLedgerItem[] = [];
  const baseDate = new Date('2026-04-05'); // H+1 Lebaran

  for (let i = 1; i <= 50; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + (i - 1) * 7);

    let status: WeeklyLedgerItem['status'] = 'PENDING_PAYMENT';
    let paidDate: string | undefined = undefined;

    if (i <= 18) {
      status = 'VERIFIED';
      paidDate = new Date(dueDate.getTime() + 86400000).toISOString();
    } else if (i === 19) {
      status = 'WAITING_VERIFICATION';
      paidDate = new Date().toISOString();
    }

    ledgers.push({
      id: `ldg-${i}`,
      memberSavingId: 'sav-001',
      weekNumber: i,
      dueDate: dueDate.toISOString(),
      paidDate,
      amount: weeklyAmount,
      paymentMethod: 'BANK_TRANSFER',
      proofImageUrl: i <= 19 ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500' : undefined,
      status,
    });
  }
  return ledgers;
};

interface NasabahState {
  program: SavingsProgram;
  bundle: PackageBundle | null;
  ledgers: WeeklyLedgerItem[];
  withdrawals: EmergencyWithdrawalRequest[];
  emergencyQuotaUsed: boolean;
  totalEmergencyWithdrawn: number;

  // Actions
  selectBundle: (bundle: PackageBundle | null) => void;
  payWeek: (weekNumber: number, proofImageUrl: string) => void;
  requestEmergencyWithdrawal: (amount: number, reason: string) => { success: boolean; message: string };
  getPayoutSummary: () => ReturnType<typeof calculateEndCyclePayout>;
}

export const useNasabahStore = create<NasabahState>()(
  persist(
    (set, get) => ({
      program: {
        id: 'prog-100k',
        cycleId: 'cyc-1447',
        name: 'Tabungan Berkah 100k',
        weeklyNominal: 100000,
        targetWeeks: 50,
        adminFee: 25000,
        isActive: true,
      },

      bundle: {
        id: 'bun-sembako-1',
        name: 'Paket Sembako Berkah Lebaran',
        slug: 'paket-sembako-berkah',
        description: 'Daging sapi segar 1kg, Telur 1 tray, Minyak goreng 2L, Beras premium 5kg.',
        bundlePrice: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        isActive: true,
      },

      ledgers: generateInitialLedgers(100000),
      withdrawals: [],
      emergencyQuotaUsed: false,
      totalEmergencyWithdrawn: 0,

      selectBundle: (bundle) => {
        set({ bundle });
      },

      payWeek: (weekNumber, proofImageUrl) => {
        set((state) => ({
          ledgers: state.ledgers.map((l) =>
            l.weekNumber === weekNumber
              ? {
                  ...l,
                  status: 'WAITING_VERIFICATION',
                  proofImageUrl,
                  paidDate: new Date().toISOString(),
                }
              : l
          ),
        }));
      },

      requestEmergencyWithdrawal: (amount, reason) => {
        const state = get();
        const currentBalance = state.ledgers
          .filter((l) => l.status === 'VERIFIED')
          .reduce((sum, l) => sum + l.amount, 0);

        const validation = validateEmergencyWithdrawal(
          currentBalance,
          amount,
          state.program.adminFee,
          state.withdrawals.length,
          state.totalEmergencyWithdrawn
        );

        if (!validation.isValid) {
          return { success: false, message: validation.message || 'Pengajuan tidak valid.' };
        }

        const newWithdrawal: EmergencyWithdrawalRequest = {
          id: `emg-${Date.now()}`,
          memberSavingId: 'sav-001',
          userId: 'usr-nasabah-01',
          amount,
          reason,
          status: 'PENDING_APPROVAL',
          createdAt: new Date().toISOString(),
        };

        set({
          withdrawals: [newWithdrawal, ...state.withdrawals],
          emergencyQuotaUsed: true,
          totalEmergencyWithdrawn: state.totalEmergencyWithdrawn + amount,
        });

        return { success: true, message: 'Permintaan penarikan darurat berhasil diajukan untuk ditinjau admin.' };
      },

      getPayoutSummary: () => {
        const state = get();
        const totalSaved = state.ledgers
          .filter((l) => l.status === 'VERIFIED')
          .reduce((sum, l) => sum + l.amount, 0);

        const bundlePrice = state.bundle ? state.bundle.bundlePrice : 0;
        const totalWithdrawn = state.withdrawals
          .filter((w) => w.status === 'COMPLETED' || w.status === 'APPROVED' || w.status === 'PENDING_APPROVAL')
          .reduce((sum, w) => sum + w.amount, 0);

        return calculateEndCyclePayout({
          totalSavedAmount: totalSaved,
          adminFeeAmount: state.program.adminFee,
          packageGoodsAmount: bundlePrice,
          emergencyDeductionAmount: totalWithdrawn,
        });
      },
    }),
    {
      name: 'nabungid-nasabah-storage',
    }
  )
);
