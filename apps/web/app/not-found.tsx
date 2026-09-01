'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, Home, ArrowLeft, Coins } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Visual 404 Motif */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Coins className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Halaman atau tautan tabungan yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buka Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
