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

const initialCategories: ProductCategory[] = [
  { id: 'cat-sembako', name: 'Sembako Mentah', slug: 'sembako-mentah', icon: 'Beef' },
  { id: 'cat-snack', name: 'Makanan & Kue Kaleng', slug: 'makanan-kue-kaleng', icon: 'Cookie' },
  { id: 'cat-perabot', name: 'Perabotan Rumah Tangga', slug: 'perabotan', icon: 'Utensils' },
];

const initialItems: ProductItem[] = [
  { id: 'item-1', categoryId: 'cat-sembako', name: 'Daging Sapi Segar 1 Kg', unit: 'kg', estimatedPrice: 140000, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500', isAvailable: true },
  { id: 'item-2', categoryId: 'cat-sembako', name: 'Minyak Goreng Premium 2L', unit: 'pouch', estimatedPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', isAvailable: true },
  { id: 'item-3', categoryId: 'cat-sembako', name: 'Telur Ayam Ras 1 Tray (30 Butir)', unit: 'tray', estimatedPrice: 55000, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500', isAvailable: true },
  { id: 'item-4', categoryId: 'cat-sembako', name: 'Beras Pandan Wangi 5 Kg', unit: 'karung', estimatedPrice: 85000, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', isAvailable: true },
  { id: 'item-5', categoryId: 'cat-snack', name: 'Biskuit Khong Guan Kaleng Merah 1600g', unit: 'kaleng', estimatedPrice: 110000, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', isAvailable: true },
  { id: 'item-6', categoryId: 'cat-snack', name: 'Sirup Marjan Boudoin Cocopandan (2 Botol)', unit: 'set', estimatedPrice: 46000, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', isAvailable: true },
  { id: 'item-7', categoryId: 'cat-snack', name: 'Kue Kering Nastar Wisman Premium 500g', unit: 'toples', estimatedPrice: 135000, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', isAvailable: true },
  { id: 'item-8', categoryId: 'cat-perabot', name: 'Set Wajan Granit Anti Lengket 28cm + Spatula', unit: 'set', estimatedPrice: 185000, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500', isAvailable: true },
  { id: 'item-9', categoryId: 'cat-perabot', name: 'Set 6 Toples Kaca Kristal Kedap Udara', unit: 'set', estimatedPrice: 145000, imageUrl: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=500', isAvailable: true },
];

const initialBundles: PackageBundle[] = [
  {
    id: 'bun-sembako-1',
    name: 'Paket Sembako Berkah Lebaran',
    slug: 'paket-sembako-berkah',
    description: 'Daging sapi segar 1kg, Telur 1 tray, Minyak goreng 2L, Beras premium 5kg.',
    bundlePrice: 318000,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    isActive: true,
  },
  {
    id: 'bun-hampers-1',
    name: 'Paket Kue & Snack Spesial Hari Raya',
    slug: 'paket-kue-spesial',
    description: 'Biskuit Khong Guan Kaleng, Nastar Wisman Premium, dan 2 Botol Sirup Marjan.',
    bundlePrice: 291000,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
    isActive: true,
  },
  {
    id: 'bun-perabot-1',
    name: 'Paket Perabotan Dapur Idul Fitri',
    slug: 'paket-perabotan-dapur',
    description: 'Set Wajan Granit Anti Lengket 28cm dan Set 6 Toples Kaca Kristal.',
    bundlePrice: 330000,
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500',
    isActive: true,
  },
];

export interface PendingLedgerItem extends WeeklyLedgerItem {
  userName: string;
  userPhone: string;
}

export interface PendingWithdrawalItem extends EmergencyWithdrawalRequest {
  userName: string;
  userPhone: string;
  currentBalance: number;
}

interface AdminState {
  programs: SavingsProgram[];
  categories: ProductCategory[];
  items: ProductItem[];
  bundles: PackageBundle[];
  pendingLedgers: PendingLedgerItem[];
  pendingWithdrawals: PendingWithdrawalItem[];

  // Master Data Actions
  addProductItem: (item: Omit<ProductItem, 'id'>) => void;
  updateProductItem: (id: string, item: Partial<ProductItem>) => void;
  deleteProductItem: (id: string) => void;

  addBundle: (bundle: Omit<PackageBundle, 'id'>) => void;
  updateBundle: (id: string, bundle: Partial<PackageBundle>) => void;
  deleteBundle: (id: string) => void;

  // Verification Actions
  verifyLedger: (id: string, approve: boolean, rejectionReason?: string) => void;
  approveWithdrawal: (id: string, approve: boolean, proofImageUrl?: string, rejectionReason?: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      programs: [
        {
          id: 'prog-100k',
          cycleId: 'cyc-1447',
          name: 'Tabungan Berkah 100k',
          weeklyNominal: 100000,
          targetWeeks: 50,
          adminFee: 25000,
          isActive: true,
        },
        {
          id: 'prog-50k',
          cycleId: 'cyc-1447',
          name: 'Tabungan Berkah 50k',
          weeklyNominal: 50000,
          targetWeeks: 50,
          adminFee: 20000,
          isActive: true,
        },
      ],
      categories: initialCategories,
      items: initialItems,
      bundles: initialBundles,

      pendingLedgers: [
        {
          id: 'ldg-pending-01',
          memberSavingId: 'sav-001',
          weekNumber: 19,
          dueDate: '2026-08-10T00:00:00.000Z',
          paidDate: new Date().toISOString(),
          amount: 100000,
          paymentMethod: 'BANK_TRANSFER',
          proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
          status: 'WAITING_VERIFICATION',
          userName: 'Ahmad Arif',
          userPhone: '081234567890',
        },
        {
          id: 'ldg-pending-02',
          memberSavingId: 'sav-002',
          weekNumber: 18,
          dueDate: '2026-08-03T00:00:00.000Z',
          paidDate: new Date().toISOString(),
          amount: 100000,
          paymentMethod: 'BANK_TRANSFER',
          proofImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500',
          status: 'WAITING_VERIFICATION',
          userName: 'Siti Rahmawati',
          userPhone: '085711223344',
        },
      ],

      pendingWithdrawals: [
        {
          id: 'emg-req-01',
          memberSavingId: 'sav-002',
          userId: 'usr-002',
          amount: 400000,
          reason: 'Kebutuhan mendesak pengobatan keluarga.',
          status: 'PENDING_APPROVAL',
          userName: 'Siti Rahmawati',
          userPhone: '085711223344',
          currentBalance: 1800000,
          createdAt: new Date().toISOString(),
        },
      ],

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

      verifyLedger: (id, approve, rejectionReason) => {
        set((state) => ({
          pendingLedgers: state.pendingLedgers.filter((l) => l.id !== id),
        }));
      },

      approveWithdrawal: (id, approve, proofImageUrl, rejectionReason) => {
        set((state) => ({
          pendingWithdrawals: state.pendingWithdrawals.filter((w) => w.id !== id),
        }));
      },
    }),
    {
      name: 'nabungid-admin-storage',
    }
  )
);
