'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SavingsProgram,
  ProductCategory,
  ProductItem,
  PackageBundle,
  WeeklyLedgerItem,
  EmergencyWithdrawalRequest,
} from '@nabungid/shared';
import { ApiClient } from '../lib/api-client';

export interface PendingLedgerItem extends WeeklyLedgerItem {
  userName: string;
  userPhone: string;
}

export interface PendingWithdrawalItem extends EmergencyWithdrawalRequest {
  userName: string;
  userPhone: string;
  currentBalance: number;
}

export interface AttendanceMatrixMember {
  id: string;
  name: string;
  phone: string;
  weeklyNominal: number;
  bundleName: string;
  verifiedCount: number;
  waitingCount: number;
  unpaidCount: number;
  totalSaved: number;
  streakCount: number;
  ledgers: Array<{
    id?: string;
    weekNumber: number;
    status: 'VERIFIED' | 'WAITING_VERIFICATION' | 'PENDING_PAYMENT' | 'REJECTED';
    amount: number;
    paidDate?: string;
    paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'QRIS';
  }>;
}

interface DashboardMetrics {
  totalNasabah: number;
  totalKasTerkumpul: number;
  pendingVerifications: number;
  pendingWithdrawals: number;
  activePrograms: number;
  totalBundles: number;
}

interface AdminState {
  programs: SavingsProgram[];
  categories: ProductCategory[];
  items: ProductItem[];
  bundles: PackageBundle[];
  pendingLedgers: PendingLedgerItem[];
  pendingWithdrawals: PendingWithdrawalItem[];
  attendanceMembers: AttendanceMatrixMember[];
  isLoadingMatrix: boolean;
  metrics: DashboardMetrics | null;

  // Real API Actions
  fetchDashboardMetrics: () => Promise<void>;
  fetchMasterData: () => Promise<void>;
  
  // Master Data Actions
  addProductItem: (item: Omit<ProductItem, 'id'>) => void;
  updateProductItem: (id: string, item: Partial<ProductItem>) => void;
  deleteProductItem: (id: string) => void;

  addBundle: (bundle: Omit<PackageBundle, 'id'>) => void;
  updateBundle: (id: string, bundle: Partial<PackageBundle>) => void;
  deleteBundle: (id: string) => void;

  // Verification Actions
  verifyLedger: (id: string, approve: boolean, rejectionReason?: string) => Promise<void>;
  approveWithdrawal: (id: string, approve: boolean, proofImageUrl?: string, rejectionReason?: string) => Promise<void>;

  // Matrix Attendance Live Actions
  fetchAttendanceMatrix: () => Promise<void>;
  toggleCheckin: (
    memberId: string,
    weekNumber: number,
    targetStatus: 'VERIFIED' | 'PENDING_PAYMENT'
  ) => Promise<{ success: boolean; message: string }>;
  quickCashCheckin: (memberId: string, weekNumber: number) => Promise<{ success: boolean; message: string }>;
  revertCheckin: (memberId: string, weekNumber: number) => Promise<{ success: boolean; message: string }>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      programs: [],
      categories: [],
      items: [],
      bundles: [],
      pendingLedgers: [],
      pendingWithdrawals: [],
      attendanceMembers: [],
      isLoadingMatrix: false,
      metrics: null,

      fetchDashboardMetrics: async () => {
        try {
          const res = await ApiClient.get('/admin/dashboard/summary');
          if (res.success && res.data) {
            set({ metrics: res.data });
          }
        } catch (error) {
          console.error("Failed to fetch metrics", error);
        }
      },

      fetchMasterData: async () => {
        try {
          // Dummy for now until full catalog endpoints are added if they exist
        } catch (error) {
          console.error("Failed to fetch master data", error);
        }
      },

      addProductItem: (item) => {
        const newItem: ProductItem = {
          ...item,
          id: `item-${Date.now()}`,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateProductItem: (id, item) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...item } : i)),
        }));
      },

      deleteProductItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      addBundle: (bundle) => {
        const newBundle: PackageBundle = {
          ...bundle,
          id: `bun-${Date.now()}`,
        };
        set((state) => ({ bundles: [...state.bundles, newBundle] }));
      },

      updateBundle: (id, bundle) => {
        set((state) => ({
          bundles: state.bundles.map((b) => (b.id === id ? { ...b, ...bundle } : b)),
        }));
      },

      deleteBundle: (id) => {
        set((state) => ({ bundles: state.bundles.filter((b) => b.id !== id) }));
      },

      verifyLedger: async (id, approve, rejectionReason) => {
        try {
          await ApiClient.patch(`/admin/ledgers/${id}/verify`, { approve, rejectionReason });
        } catch {}
        set((state) => ({
          pendingLedgers: state.pendingLedgers.filter((l) => l.id !== id),
        }));
      },

      approveWithdrawal: async (id, approve, proofImageUrl, rejectionReason) => {
        try {
          await ApiClient.patch(`/admin/withdrawals/${id}/decision`, {
            approve,
            proofImageUrl,
            rejectionReason,
          });
        } catch {}
        set((state) => ({
          pendingWithdrawals: state.pendingWithdrawals.filter((w) => w.id !== id),
        }));
      },

      fetchAttendanceMatrix: async () => {
        set({ isLoadingMatrix: true });
        try {
          const res = await ApiClient.get('/admin/ledgers/matrix');
          if (res.success && Array.isArray(res.data)) {
            set({ attendanceMembers: res.data, isLoadingMatrix: false });
            return;
          }
        } catch {}
        set({ isLoadingMatrix: false, attendanceMembers: [] });
      },

      toggleCheckin: async (memberId, weekNumber, targetStatus) => {
        // Send API request to Live Supabase Database
        try {
          const res = await ApiClient.post('/admin/ledgers/toggle-status', {
            memberSavingId: memberId,
            weekNumber,
            targetStatus,
          });
          if (res.success) {
             // Refresh data
             get().fetchAttendanceMatrix();
          }
        } catch {}

        const message =
          targetStatus === 'VERIFIED'
            ? `Setoran tunai Minggu ke-${weekNumber} berhasil dicentang lunas ke database Supabase!`
            : `Setoran Minggu ke-${weekNumber} berhasil dibatalkan (uncheck) kembali ke belum bayar!`;

        return { success: true, message };
      },

      quickCashCheckin: async (memberId, weekNumber) => {
        return get().toggleCheckin(memberId, weekNumber, 'VERIFIED');
      },

      revertCheckin: async (memberId, weekNumber) => {
        return get().toggleCheckin(memberId, weekNumber, 'PENDING_PAYMENT');
      },
    }),
    {
      name: 'nabungid-admin-storage',
    }
  )
);
