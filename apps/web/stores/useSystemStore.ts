'use client';

import { create } from 'zustand';
import { MaintenanceConfig } from '@nabungid/shared';
import { ApiClient } from '../lib/api-client';

interface SystemState {
  maintenance: MaintenanceConfig;
  isLoading: boolean;
  fetchStatus: () => Promise<MaintenanceConfig>;
  updateMaintenance: (config: MaintenanceConfig) => Promise<{ success: boolean; message: string }>;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  maintenance: {
    isMaintenance: false,
    message: 'Aplikasi sedang dalam pemeliharaan sistem berkala untuk peningkatan performa server menyambut Idul Fitri.',
    estimatedEndTime: 'Segera kembali dalam beberapa saat',
    contactWhatsapp: '089988776655',
  },
  isLoading: false,

  fetchStatus: async () => {
    try {
      const res = await ApiClient.get('/system/status');
      if (res.success && res.data) {
        set({ maintenance: res.data });
        return res.data;
      }
    } catch (e) {
      console.warn('Failed to fetch system status:', e);
    }
    return get().maintenance;
  },

  updateMaintenance: async (config: MaintenanceConfig) => {
    set({ isLoading: true });
    try {
      const res = await ApiClient.post('/admin/system/maintenance', config);
      if (res.success && res.data) {
        set({ maintenance: res.data, isLoading: false });
        return {
          success: true,
          message: res.message || 'Pengaturan pemeliharaan sistem berhasil diperbarui.',
        };
      }
      set({ isLoading: false });
      return {
        success: false,
        message: res.message || 'Gagal memperbarui mode pemeliharaan.',
      };
    } catch (err: any) {
      set({ isLoading: false });
      return {
        success: false,
        message: err.message || 'Terjadi kesalahan saat memperbarui mode pemeliharaan.',
      };
    }
  },
}));
