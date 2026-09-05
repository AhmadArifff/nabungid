'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useSystemStore } from '../../stores/useSystemStore';

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { maintenance } = useSystemStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-2.5">
        <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold text-xs flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Super User</span>
        </span>

        {maintenance.isMaintenance ? (
          <Link
            href="/admin/maintenance"
            className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center space-x-1.5 animate-pulse hover:bg-rose-500/30 transition-colors"
            title="Klik untuk atur mode maintenance"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Mode Maintenance Aktif (Nasabah Diblokir)</span>
          </Link>
        ) : (
          <span className="text-xs text-slate-400 hidden sm:inline">• Database: Supabase PostgreSQL (Port 6543)</span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
            A
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-amber-400">Pengelola Tabungan</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Keluar Admin"
          className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
