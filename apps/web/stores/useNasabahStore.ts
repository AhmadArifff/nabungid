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

interface NasabahState {
  program: SavingsProgram | null;
  bundle: PackageBundle | null;
  ledgers: WeeklyLedgerItem[];
  withdrawals: EmergencyWithdrawalRequest[];
  emergencyQuotaUsed: boolean;
  totalEmergencyWithdrawn: number;
  savingId: string | null;

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
      savingId: null,
      program: null,
      bundle: null,
      ledgers: [],
      withdrawals: [],
      emergencyQuotaUsed: false,
      totalEmergencyWithdrawn: 0,

      fetchMySavings: async () => {
        try {
          const res = await ApiClient.get('/nasabah/savings');
          if (res.success && res.data) {
            set({
              savingId: res.data.id || null,
              program: res.data.program || null,
              bundle: res.data.bundle || null,
              ledgers: res.data.ledgers || [],
              withdrawals: res.data.withdrawals || [],
            });
          } else {
            // Jika tidak ada data (belum enroll, dsb), kosongkan state
            set({
              savingId: null,
              program: null,
              bundle: null,
              ledgers: [],
              withdrawals: [],
            });
          }
        } catch (error) {
          console.error("Gagal mengambil data tabungan:", error);
        }
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
        if (!state.program || !state.savingId) {
          return { success: false, message: 'Data program tabungan tidak ditemukan.' };
        }
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
          userId: 'usr-nasabah-01', // Ideally should be from AuthStore
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
        if (!state.program) {
          return calculateEndCyclePayout({
            totalSavedAmount: 0,
            adminFeeAmount: 0,
            packageGoodsAmount: 0,
            emergencyDeductionAmount: 0,
          });
        }
        
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
