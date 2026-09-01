'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Role } from '@nabungid/shared';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToastStore } from '../../stores/useToastStore';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, role } = useAuthStore();
  const { warning, error } = useToastStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Guard 1: Must be authenticated
    if (!isAuthenticated || !user) {
      warning('Silakan masuk terlebih dahulu untuk mengakses halaman ini.', 'Akses Terbatas');
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Guard 2: Role check
    if (allowedRoles && allowedRoles.length > 0 && role) {
      if (!allowedRoles.includes(role)) {
        error(
          'Anda tidak memiliki hak akses Administrator untuk membuka halaman ini.',
          'Akses Ditolak'
        );
        router.replace('/dashboard');
      }
    }
  }, [isHydrated, isAuthenticated, user, role, allowedRoles, pathname, router, warning, error]);

  // Loading state during hydration or auth validation
  if (!isHydrated || !isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div className="text-xs font-mono text-slate-400">Memeriksa hak akses keamanan...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
