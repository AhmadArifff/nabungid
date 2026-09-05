'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coins,
  LayoutDashboard,
  CheckSquare,
  ShieldAlert,
  Database,
  Gift,
  ArrowLeft,
  BookOpen,
  Wrench,
} from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useSystemStore } from '../../stores/useSystemStore';

const MENU_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard Ringkasan', icon: LayoutDashboard },
  { href: '/admin/absensi', label: 'Buku Tabungan (50 Minggu)', icon: BookOpen },
  { href: '/admin/verifikasi', label: 'Verifikasi Setoran', icon: CheckSquare, badgeKey: 'pendingLedgers' },
  { href: '/admin/penarikan', label: 'Persetujuan Darurat', icon: ShieldAlert, badgeKey: 'pendingWithdrawals' },
  { href: '/admin/master-data', label: 'Master Data (Zero Hardcode)', icon: Database },
  { href: '/admin/distribusi', label: 'Distribusi & Payout H-1', icon: Gift },
  { href: '/admin/maintenance', label: 'Mode Maintenance', icon: Wrench, isMaintenanceItem: true },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { pendingLedgers, pendingWithdrawals } = useAdminStore();
  const { maintenance } = useSystemStore();

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold font-heading text-white">
              Nabung<span className="text-amber-400">ID</span>
            </div>
            <div className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
              Admin Console
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const badgeCount =
              item.badgeKey === 'pendingLedgers'
                ? pendingLedgers.length
                : item.badgeKey === 'pendingWithdrawals'
                ? pendingWithdrawals.length
                : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {badgeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                    {badgeCount}
                  </span>
                )}
                {item.isMaintenanceItem && maintenance.isMaintenance && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold animate-pulse">
                    AKTIF
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Switch to Nasabah View Link */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/dashboard"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lihat Tampilan Nasabah</span>
        </Link>
      </div>
    </aside>
  );
};
