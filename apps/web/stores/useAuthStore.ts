'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Role } from '@nabungid/shared';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: Role | null;
  loginAsNasabah: (email?: string, name?: string) => void;
  loginAsAdmin: (email?: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr-nasabah-01',
        name: 'Ahmad Arif',
        email: 'ahmad@example.com',
        phoneNumber: '081234567890',
        role: 'NASABAH',
        avatarUrl: undefined,
        address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      },
      isAuthenticated: true,
      role: 'NASABAH',

      loginAsNasabah: (email = 'ahmad@example.com', name = 'Ahmad Arif') => {
        set({
          user: {
            id: 'usr-nasabah-01',
            name,
            email,
            phoneNumber: '081234567890',
            role: 'NASABAH',
            address: 'Jl. Merdeka No. 45, Jakarta Selatan',
          },
          isAuthenticated: true,
          role: 'NASABAH',
        });
      },

      loginAsAdmin: (email = 'admin@nabungid.com', name = 'Admin Pengelola') => {
        set({
          user: {
            id: 'usr-admin-01',
            name,
            email,
            phoneNumber: '089988776655',
            role: 'ADMIN',
          },
          isAuthenticated: true,
          role: 'ADMIN',
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          role: null,
        });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'nabungid-auth-storage',
    }
  )
);
