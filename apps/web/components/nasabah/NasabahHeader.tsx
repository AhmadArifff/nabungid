'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coins, LogOut, Shield, Bell, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const NasabahHeader: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-md shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="text-lg font-bold font-heading text-white hidden sm:inline">
              Nabung<span className="text-amber-400">ID</span>
            </span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Program Pill */}
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Periode 1447H (H+1 s.d H-1)</span>
          </div>
        </div>

        {/* User Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick User Badge */}
          <div className="flex items-center space-x-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Nasabah NabungID'}</div>
              <div className="text-[10px] text-slate-400">{user?.phoneNumber || '081234567890'}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Keluar Akun"
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
