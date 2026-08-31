import React from 'react';
import { Metadata } from 'next';
import { LoginForm } from '../../../components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Masuk Akun | NabungID - Tabungan 100rb Mingguan Idul Fitri',
  description: 'Masuk ke portal nasabah atau admin panel NabungID.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Auras */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full py-8">
        <LoginForm />
      </div>
    </main>
  );
}
