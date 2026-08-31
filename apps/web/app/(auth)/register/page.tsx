import React from 'react';
import { Metadata } from 'next';
import { RegisterForm } from '../../../components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Daftar Akun Tabungan | NabungID',
  description: 'Daftar program tabungan 100rb mingguan Idul Fitri NabungID.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full py-6">
        <RegisterForm />
      </div>
    </main>
  );
}
