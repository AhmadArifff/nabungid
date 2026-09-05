'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  MessageCircle,
  RefreshCw,
  Coins,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function MaintenancePage() {
  const router = useRouter();
  const { maintenance, fetchStatus, isLoading } = useSystemStore();
  const { user } = useAuthStore();

  // Polling / Check if maintenance is turned off, automatically redirect
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(async () => {
      const status = await fetchStatus();
      if (!status.isMaintenance) {
        if (user?.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user?.role === 'NASABAH') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [fetchStatus, router, user]);

  const handleManualRefresh = async () => {
    const status = await fetchStatus();
    if (!status.isMaintenance) {
      router.push('/');
    }
  };

  const whatsappNumber = maintenance.contactWhatsapp || '089988776655';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20Admin%20NabungID,%20saya%20ingin%20bertanya%20mengenai%20pemeliharaan%20sistem%20tabungan.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[300px] bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Header Minimal Brand */}
      <header className="px-6 py-6 border-b border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-xl font-bold font-heading text-white">
              Nabung<span className="text-amber-400">ID</span>
            </span>
          </Link>

          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Khusus Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-xl w-full text-center">
          {/* Animated Maintenance Icon Badge */}
          <div className="inline-flex relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-emerald-500/20 border border-amber-400/30 p-1 flex items-center justify-center shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
              <div className="w-full h-full rounded-[22px] bg-slate-950/80 flex items-center justify-center relative">
                <Wrench className="w-10 h-10 text-amber-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sistem Sedang Dalam Pemeliharaan Terjadwal</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Peningkatan Layanan Tabungan Idul Fitri
          </h1>

          {/* Subtitle / Explanation */}
          <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto">
            {maintenance.message ||
              'Kami sedang melakukan peningkatan performa infrastruktur server untuk memastikan seluruh pencatatan tabungan 50 minggu berjalan lebih cepat, aman, dan tanpa kendala.'}
          </p>

          {/* Glass Card Details: Estimasi & Info */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl mb-8 text-left space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Estimasi Waktu Selesai</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {maintenance.estimatedEndTime || 'Segera kembali dalam beberapa saat'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Sistem otomatis membuka akses nasabah kembali segera setelah pemeliharaan selesai.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Keamanan Saldo Anda Terjamin</div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Seluruh saldo tabungan, catatan setoran mingguan, dan buku kas tersimpan aman di database cloud PostgreSQL terenkripsi.
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Pengurus WhatsApp</span>
            </a>

            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-white/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Cek Status & Refresh</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/5 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 NabungID Platform Tabungan Idul Fitri 1447H • Dikembangkan dengan penuh amanah</p>
      </footer>
    </div>
  );
}
