'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  CheckCircle2,
  Clock,
  Upload,
  Flame,
  Award,
  Sparkles,
  Printer,
  Share2,
  Calendar,
  Check,
  ShieldCheck,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { WeeklyLedgerItem } from '@nabungid/shared';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNasabahStore } from '../../stores/useNasabahStore';
import { DigitalReceiptModal } from './DigitalReceiptModal';

interface WeeklyCheckinCardProps {
  ledgers: WeeklyLedgerItem[];
  onOpenCheckin: (ledger: WeeklyLedgerItem) => void;
}

export const WeeklyCheckinCard: React.FC<WeeklyCheckinCardProps> = ({
  ledgers,
  onOpenCheckin,
}) => {
  const { user } = useAuthStore();
  const { program } = useNasabahStore();
  const [viewMode, setViewMode] = useState<'STAMP_CARD' | 'TABLE_VIEW'>('STAMP_CARD');
  const [filterMode, setFilterMode] = useState<'ALL' | 'VERIFIED' | 'WAITING' | 'PENDING'>('ALL');
  const [printSuccessToast, setPrintSuccessToast] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<WeeklyLedgerItem | null>(null);

  // Statistics
  const verifiedCount = ledgers.filter((l) => l.status === 'VERIFIED').length;
  const waitingCount = ledgers.filter((l) => l.status === 'WAITING_VERIFICATION').length;
  const pendingCount = ledgers.filter((l) => l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED').length;
  const nextPayableWeek = ledgers.find((l) => l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED');
  const currentWeekNumber = verifiedCount + (waitingCount > 0 ? 1 : 0);

  // Filtered Ledgers
  const displayedLedgers = ledgers.filter((l) => {
    if (filterMode === 'VERIFIED') return l.status === 'VERIFIED';
    if (filterMode === 'WAITING') return l.status === 'WAITING_VERIFICATION';
    if (filterMode === 'PENDING') return l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED';
    return true;
  });

  const handlePrint = () => {
    setPrintSuccessToast(true);
    setTimeout(() => {
      window.print();
      setPrintSuccessToast(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 🌟 Top Physical Member Stamp Pass Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border-2 border-amber-400/30 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Decorative Golden Corner Accents & Shimmer */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        {/* Member Pass Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-start sm:items-center space-x-4">
            {/* Member Gold Stamp Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 p-0.5 shadow-lg shadow-amber-950/50">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-xl text-amber-300 font-heading">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
                </div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  KARTU ABSENSI RESMI
                </span>
                <span className="text-[11px] font-mono text-slate-400">#NBD-1447-0{verifiedCount}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {user?.name || 'Nasabah NabungID'}
              </h2>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                <span>WhatsApp: <strong className="text-white font-mono">{user?.phoneNumber || '081234567890'}</strong></span>
                <span>•</span>
                <span>Program: <strong className="text-amber-300">Rp {program.weeklyNominal.toLocaleString('id-ID')} / Minggu</strong></span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors flex items-center space-x-1.5 print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu Absen</span>
            </button>
            {nextPayableWeek && (
              <button
                onClick={() => onOpenCheckin(nextPayableWeek)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-1.5 print:hidden"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Cek-in Minggu Ke-{nextPayableWeek.weekNumber}</span>
              </button>
            )}
          </div>
        </div>

        {/* Gamified Streak & Attendance Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400 mb-1">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" style={{ animationDuration: '2s' }} />
              <span>Disiplin Streak</span>
            </div>
            <div className="text-xl font-black font-mono text-white">
              {verifiedCount} <span className="text-xs font-normal text-slate-400 font-sans">Minggu Berturut</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Stempel Lunas</span>
            </div>
            <div className="text-xl font-black font-mono text-emerald-400">
              {verifiedCount} / 50 <span className="text-xs font-normal text-slate-400 font-sans">Cap</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300 mb-1">
              <Clock className="w-4 h-4" />
              <span>Menunggu Verifikasi</span>
            </div>
            <div className="text-xl font-black font-mono text-amber-300">
              {waitingCount} <span className="text-xs font-normal text-slate-400 font-sans">Minggu</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sisa Menuju Idul Fitri</span>
            </div>
            <div className="text-xl font-black font-mono text-slate-200">
              {50 - verifiedCount - waitingCount} <span className="text-xs font-normal text-slate-400 font-sans">Minggu Lagi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ View Mode & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { key: 'ALL', label: `Semua (50)` },
            { key: 'VERIFIED', label: `✓ Lunas (${verifiedCount})` },
            { key: 'WAITING', label: `⏳ Diproses (${waitingCount})` },
            { key: 'PENDING', label: `⚪ Belum Cek-in (${pendingCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterMode(tab.key as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterMode === tab.key
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('STAMP_CARD')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'STAMP_CARD'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📇 Kartu Stamp Absensi
          </button>
          <button
            onClick={() => setViewMode('TABLE_VIEW')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'TABLE_VIEW'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Tabel Rekap
          </button>
        </div>
      </div>

      {/* 📇 View 1: 50-Week Interactive Stamp Card Matrix */}
      {viewMode === 'STAMP_CARD' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {displayedLedgers.map((item) => {
            const isVerified = item.status === 'VERIFIED';
            const isWaiting = item.status === 'WAITING_VERIFICATION';
            const isPending = item.status === 'PENDING_PAYMENT' || item.status === 'REJECTED';
            const isNextToPay = item.weekNumber === (nextPayableWeek?.weekNumber ?? -1);

            const dueDateObj = new Date(item.dueDate);
            const formattedDate = dueDateObj.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-2xl p-4 border transition-all flex flex-col justify-between overflow-hidden min-h-[140px] ${
                  isVerified
                    ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/40 shadow-md shadow-emerald-950/40'
                    : isWaiting
                    ? 'bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-500/40'
                    : isNextToPay
                    ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-400/20 ring-1 ring-amber-400'
                    : 'bg-slate-900/50 border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Stamp Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>Minggu {item.weekNumber}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{formattedDate}</span>
                </div>

                {/* Center Nominal */}
                <div className="my-1">
                  <div className="text-base font-black font-mono text-white">
                    Rp {item.amount.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* 🌟 Authentic Stamp Badge Section */}
                <div className="mt-2 pt-2 border-t border-white/5">
                  {isVerified && (
                    <button
                      onClick={() => setSelectedReceipt(item)}
                      title="Klik untuk melihat & unduh Kwitansi Digital Resmi"
                      className="w-full relative flex items-center justify-center p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 transition-colors group/stamp cursor-pointer"
                    >
                      {/* Stamp Seal Effect */}
                      <div className="flex items-center space-x-1 text-[11px] font-black tracking-wider uppercase group-hover/stamp:scale-105 transition-transform">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                        <span>LUNAS ✓</span>
                      </div>
                    </button>
                  )}

                  {isWaiting && (
                    <div className="flex items-center justify-center space-x-1 p-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                      <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>MENUNGGU VERIFIKASI</span>
                    </div>
                  )}

                  {isPending && (
                    <button
                      onClick={() => onOpenCheckin(item)}
                      className={`w-full py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 shadow ${
                        isNextToPay
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110'
                          : 'bg-slate-800 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isNextToPay ? 'Cek-in Sekarang' : 'Cek-in'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 📋 View 2: Detailed Table View */}
      {viewMode === 'TABLE_VIEW' && (
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Minggu Ke-</th>
                <th className="py-3.5 px-4">Jatuh Tempo</th>
                <th className="py-3.5 px-4">Nominal Iuran</th>
                <th className="py-3.5 px-4">Metode & Bukti</th>
                <th className="py-3.5 px-4">Status Absensi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {displayedLedgers.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white font-sans">
                    Minggu ke-{l.weekNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(l.dueDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">
                    Rp {l.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-400">
                    {l.proofImageUrl ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Bukti Terunggah</span>
                      </span>
                    ) : (
                      'Belum ada bukti'
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {l.status === 'VERIFIED' && (
                      <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>LUNAS ✓</span>
                      </span>
                    )}
                    {l.status === 'WAITING_VERIFICATION' && (
                      <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-amber-400/15 text-amber-300 font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Menunggu Review</span>
                      </span>
                    )}
                    {(l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED') && (
                      <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-slate-800 text-slate-400 font-semibold text-[11px]">
                        <span>Belum Cek-in</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🖨️ Print-Only Official Footer & Signatures Block */}
      <div className="hidden print:block pt-8 mt-8 border-t border-slate-400 break-inside-avoid">
        <div className="flex justify-between items-start text-xs text-slate-800">
          <div>
            <div className="font-bold">Ketentuan Pencairan:</div>
            <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5 mt-1">
              <li>Pencairan dana & paket barang dilakukan tepat pada H-1 Idul Fitri 1447H.</li>
              <li>Kartu ini adalah bukti sah kepesertaan tabungan fisik digital.</li>
            </ul>
          </div>
          <div className="text-right text-[10px] text-slate-600 font-mono">
            Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
          </div>
        </div>

        {/* Signature Columns */}
        <div className="grid grid-cols-2 gap-12 pt-10 text-center text-xs">
          <div className="space-y-16">
            <div className="text-slate-700 font-semibold">Nasabah Penabung,</div>
            <div className="border-b border-slate-900 mx-8 font-bold text-slate-900">
              ( {user?.name || 'Ahmad Arif'} )
            </div>
          </div>

          <div className="space-y-16">
            <div className="text-slate-700 font-semibold">Pengurus / Admin Tabungan,</div>
            <div className="border-b border-slate-900 mx-8 font-bold text-slate-900">
              ( Pengelola Kas NabungID )
            </div>
          </div>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={Boolean(selectedReceipt)}
        ledger={selectedReceipt}
        userName={user?.name || 'Ahmad Arif'}
        userPhone={user?.phoneNumber || '081234567890'}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
