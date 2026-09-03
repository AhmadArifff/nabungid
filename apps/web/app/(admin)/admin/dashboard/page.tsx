'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Coins,
  Users,
  CheckSquare,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useAdminStore } from '../../../../stores/useAdminStore';

export default function AdminDashboardPage() {
  const {
    attendanceMembers,
    pendingLedgers,
    pendingWithdrawals,
    items,
    bundles,
    metrics,
    fetchAttendanceMatrix,
    fetchDashboardMetrics,
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardMetrics();
    fetchAttendanceMatrix();
  }, [fetchAttendanceMatrix, fetchDashboardMetrics]);

  const totalNasabah = metrics ? metrics.totalNasabah : 0;
  const kasDisplay = metrics ? metrics.totalKasTerkumpul : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Data Sync Database</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Ringkasan Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ikhtisar operasional tabungan 50 minggu periode 1447H / 2026M
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              fetchDashboardMetrics();
              fetchAttendanceMatrix();
            }}
            className="p-2.5 rounded-xl bg-slate-850 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/verifikasi"
            className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-colors flex items-center space-x-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Verifikasi Setoran ({pendingLedgers.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Kas Terkumpul</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              Rp {kasDisplay.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Akumulasi dari {totalNasabah} nasabah aktif</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Nasabah Terdaftar</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white">{totalNasabah} Nasabah</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Siklus Aktif 1447 Hijriyah</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Menunggu Verifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400">{pendingLedgers.length} Setoran</div>
            <Link href="/admin/verifikasi" className="text-[10px] text-amber-400 hover:underline mt-1 block">
              Klik untuk proses verifikasi →
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-rose-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Pengajuan Tarik Darurat</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-rose-400">{pendingWithdrawals.length} Klaim</div>
            <Link href="/admin/penarikan" className="text-[10px] text-rose-400 hover:underline mt-1 block">
              Maks Rp 500rb per klaim →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Tables & Master Data Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Ledger Quick Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Antrean Bukti Transfer Masuk</span>
            </h3>
            <Link href="/admin/verifikasi" className="text-xs text-amber-400 hover:underline">
              Lihat Semua ({pendingLedgers.length})
            </Link>
          </div>

          <div className="space-y-3">
            {pendingLedgers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Tidak ada setoran yang menunggu verifikasi saat ini.
              </div>
            ) : (
              pendingLedgers.slice(0, 4).map((l) => (
                <div key={l.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{l.userName}</div>
                    <div className="text-[11px] text-slate-400">
                      Minggu ke-{l.weekNumber} • <span className="text-amber-300 font-mono font-semibold">Rp {l.amount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/verifikasi"
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors"
                  >
                    Periksa
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Master Data Snapshot */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Master Data Dinamis (Zero Hardcode)</span>
            </h3>
            <Link href="/admin/master-data" className="text-xs text-emerald-400 hover:underline">
              Kelola Master Data
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <div className="text-slate-400 text-[10px]">Total Item Produk</div>
              <div className="text-xl font-bold font-mono text-white mt-1">{items.length} Item</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Daging, Minyak, Telur, dll</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <div className="text-slate-400 text-[10px]">Paket Bundling Aktif</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">{bundles.length} Paket</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sembako, Kue, Perabot</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Buku Absensi 50 Minggu:</span>
            <Link href="/admin/absensi" className="text-amber-400 font-semibold hover:underline flex items-center space-x-1">
              <span>Buka Matriks Absensi</span>
              <ArrowUpRight className="w-3.5 h-3.5 inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
