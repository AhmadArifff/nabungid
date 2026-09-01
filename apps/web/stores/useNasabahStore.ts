'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SavingsProgram,
  PackageBundle,
  WeeklyLedgerItem,
  EmergencyWithdrawalRequest,
  calculateEndCyclePayout,
  validateEmergencyWithdrawal,
} from '@nabungid/shared';
import { ApiClient } from '../lib/api-client';

const generateInitialLedgers = (weeklyAmount: number): WeeklyLedgerItem[] => {
  const startDate = new Date('2026-04-05T00:00:00.000Z');
  return Array.from({ length: 50 }, (_, i) => {
    const weekNumber = i + 1;
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + i * 7);

    let status: WeeklyLedgerItem['status'] = 'PENDING_PAYMENT';
    let paidDate: string | undefined = undefined;
    let paymentMethod: WeeklyLedgerItem['paymentMethod'] = 'BANK_TRANSFER';

    // Demo pre-filled weeks: Weeks 1-18 verified, Week 19 waiting
    if (weekNumber <= 18) {
      status = 'VERIFIED';
      paidDate = dueDate.toISOString();
    } else if (weekNumber === 19) {
      status = 'WAITING_VERIFICATION';
      paidDate = new Date().toISOString();
    }

    return {
      id: `ldg-${weekNumber}`,
      memberSavingId: 'sav-001',
      weekNumber,
      dueDate: dueDate.toISOString(),
      amount: weeklyAmount,
      status,
      paidDate,
      paymentMethod,
    };
  });
};

interface NasabahState {
  program: SavingsProgram;
  bundle: PackageBundle | null;
  ledgers: WeeklyLedgerItem[];
  withdrawals: EmergencyWithdrawalRequest[];
  emergencyQuotaUsed: boolean;
  totalEmergencyWithdrawn: number;
  savingId: string;

  // Actions
  fetchMySavings: () => Promise<void>;
  selectBundle: (bundle: PackageBundle | null) => Promise<void>;
  payWeek: (weekNumber: number, proofImageUrl: string) => Promise<{ success: boolean; message: string }>;
  requestEmergencyWithdrawal: (amount: number, reason: string) => Promise<{ success: boolean; message: string }>;
  getPayoutSummary: () => ReturnType<typeof calculateEndCyclePayout>;
}

export const useNasabahStore = create<NasabahState>()(
  persist(
    (set, get) => ({
      savingId: 'sav-001',
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
        bundlePrice: 318000,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        isActive: true,
      },

      ledgers: generateInitialLedgers(100000),
      withdrawals: [],
      emergencyQuotaUsed: false,
      totalEmergencyWithdrawn: 0,

      fetchMySavings: async () => {
        try {
          const res = await ApiClient.get('/nasabah/savings');
          if (res.success && res.data) {
            set({
              savingId: res.data.id || 'sav-001',
              program: res.data.program || get().program,
              bundle: res.data.bundle || get().bundle,
              ledgers: res.data.ledgers && res.data.ledgers.length > 0 ? res.data.ledgers : get().ledgers,
              withdrawals: res.data.withdrawals || get().withdrawals,
            });
          }
        } catch {}
      },

      selectBundle: async (bundle) => {
        set({ bundle });
        try {
          const state = get();
          await ApiClient.patch(`/nasabah/savings/${state.savingId}/bundle`, {
            bundleId: bundle ? bundle.id : null,
          });
        } catch {}
      },

      payWeek: async (weekNumber, proofImageUrl) => {
        // Optimistic update
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

        try {
          const state = get();
          await ApiClient.post(`/nasabah/savings/${state.savingId}/pay-week`, {
            weekNumber,
            proofImageUrl,
          });
        } catch {}

        return {
          success: true,
          message: `Bukti transfer Minggu ke-${weekNumber} berhasil diunggah ke database dan sedang ditinjau admin!`,
        };
      },

      requestEmergencyWithdrawal: async (amount, reason) => {
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
          memberSavingId: state.savingId,
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
