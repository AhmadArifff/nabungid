'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Role } from '@nabungid/shared';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: Role | null;
  token: string | null;
  setCredentials: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      token: null,

      setCredentials: (user, token) => {
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
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
