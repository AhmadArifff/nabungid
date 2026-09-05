'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '../../stores/useSystemStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const GlobalMaintenanceListener: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { maintenance, fetchStatus } = useSystemStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    // If maintenance is OFF
    if (!maintenance.isMaintenance) {
      if (pathname === '/maintenance') {
        router.replace(user?.role === 'ADMIN' ? '/admin/dashboard' : '/');
      }
      return;
    }

    // If maintenance is ON:
    // 1. Admin routes are strictly exempt
    if (pathname.startsWith('/admin')) {
      return;
    }

    // 2. Allow /login page so admin can authenticate
    if (pathname === '/login') {
      return;
    }

    // 3. Already on /maintenance
    if (pathname === '/maintenance') {
      return;
    }

    // 4. Logged-in Admins have full immunity
    if (user?.role === 'ADMIN') {
      return;
    }

    // Redirect all nasabah and public guests to /maintenance
    router.replace('/maintenance');
  }, [maintenance.isMaintenance, pathname, user, router]);

  return null;
};
