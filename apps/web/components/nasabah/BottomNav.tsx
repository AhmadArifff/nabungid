'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, ShoppingBag, ShieldAlert, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/tabunganku', label: 'Tabunganku', icon: Calendar },
  { href: '/paket', label: 'Paket Barang', icon: ShoppingBag },
  { href: '/penarikan', label: 'Tarik Dana', icon: ShieldAlert },
  { href: '/profil', label: 'Akun', icon: User },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 border-t border-white/10 backdrop-blur-2xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-400/15 text-amber-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
