'use client';

import React from 'react';
import { NasabahHeader } from '../../components/nasabah/NasabahHeader';
import { BottomNav } from '../../components/nasabah/BottomNav';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['NASABAH', 'ADMIN']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-8">
        <NasabahHeader />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}

