'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coins,
  ArrowUpRight,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Upload,
  Calendar,
  Check,
} from 'lucide-react';
import { useNasabahStore } from '../../../stores/useNasabahStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { CircularProgress } from '../../../components/nasabah/CircularProgress';
import { UploadProofModal } from '../../../components/nasabah/UploadProofModal';
import { EmergencyWithdrawalModal } from '../../../components/nasabah/EmergencyWithdrawalModal';
import { WeeklyLedgerItem } from '@nabungid/shared';

export default function NasabahDashboardPage() {
  const { user } = useAuthStore();
  const { program, bundle, ledgers, withdrawals, payWeek, getPayoutSummary, fetchMySavings } = useNasabahStore();
  const [selectedLedger, setSelectedLedger] = useState<WeeklyLedgerItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const payout = getPayoutSummary();

  const verifiedWeeks = ledgers.filter((l) => l.status === 'VERIFIED').length;
  const pendingWeeks = ledgers.filter((l) => l.status === 'WAITING_VERIFICATION').length;
  const nextUnpaidLedger = ledgers.find((l) => l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED');

  const handleOpenUpload = (ledger: WeeklyLedgerItem) => {
    setSelectedLedger(ledger);
    setIsUploadOpen(true);
  };
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchMySavings().finally(() => {
      setIsLoading(false);
    });
  }, [fetchMySavings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Belum Terdaftar Program Tabungan</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md">Anda belum terdaftar atau program tabungan sedang tidak aktif. Silakan hubungi Admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Eid Countdown Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-slate-900/80 to-slate-900/80 border border-emerald-500/20 backdrop-blur-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Tabungan Berkah 50 Minggu
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                {user?.name || 'Nasabah'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Target pencairan H-1 Idul Fitri 1447H • Rp {program.weeklyNominal.toLocaleString('id-ID')} / minggu
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {nextUnpaidLedger && (
            <button
              onClick={() => handleOpenUpload(nextUnpaidLedger)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Coins className="w-4 h-4" />
              <span>Cek-in Minggu Ke-{nextUnpaidLedger.weekNumber}</span>
            </button>
          )}
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300 font-semibold text-xs hover:bg-rose-500/10 transition-colors flex items-center space-x-1"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">Tarik Darurat</span>
          </button>
        </div>
      </div>

      {/* 📇 Mini Member Stamp Card Strip (Preview Kartu Absensi) */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-400/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Kartu Absensi Cek-in Setoran Mingguan</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                  <Flame className="w-3 h-3 fill-orange-400" />
                  <span>{verifiedWeeks} Mg Streak</span>
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Stempel kehadiran setoran digital nasabah • Disiplin tanpa bolong
              </p>
            </div>
          </div>
          <Link
            href="/tabunganku"
            className="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>Buka Kartu Absen Lengkap (50 Minggu)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick 6-Week Recent Stamp Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {ledgers.slice(14, 20).map((item) => {
            const isVerified = item.status === 'VERIFIED';
            const isWaiting = item.status === 'WAITING_VERIFICATION';
            const isNext = item.weekNumber === nextUnpaidLedger?.weekNumber;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                  isVerified
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : isWaiting
                    ? 'bg-amber-950/25 border-amber-500/40 text-amber-300'
                    : isNext
                    ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-950/40 border-white/5 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-300">Mg-{item.weekNumber}</div>
                <div className="my-1.5 flex items-center justify-center">
                  {isVerified && (
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                  {isWaiting && (
                    <div className="p-1 rounded-full bg-amber-400/20 text-amber-300">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                  {!isVerified && !isWaiting && (
                    <div className="text-xs font-mono text-slate-500">
                      Rp {(item.amount / 1000).toFixed(0)}k
                    </div>
                  )}
                </div>
                <div>
                  {isVerified ? (
                    <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider">Lunas ✓</span>
                  ) : isWaiting ? (
                    <span className="text-[9px] font-bold text-amber-300">Diproses</span>
                  ) : (
                    <button
                      onClick={() => handleOpenUpload(item)}
                      className="w-full py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] transition-colors"
                    >
                      Cek-in
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Stats: Balance & 50-Week Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progress Ring & Milestones */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <CircularProgress currentWeek={verifiedWeeks} totalWeeks={50} size={190} strokeWidth={15} />

          <div className="mt-5 w-full grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Lunas</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">{verifiedWeeks} Mg</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Menunggu</div>
              <div className="text-sm font-bold text-amber-300 font-mono">{pendingWeeks} Mg</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[10px] text-slate-400 font-medium">Sisa</div>
              <div className="text-sm font-bold text-slate-300 font-mono">{50 - verifiedWeeks - pendingWeeks} Mg</div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Payout Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Proyeksi Pembagian H-1 Idul Fitri
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                Formula PRD.md
              </span>
            </div>

            {/* Big Net Payout */}
            <div className="mb-6">
              <div className="text-xs text-slate-400">Estimasi Uang Tunai Bersih Diterima:</div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-tight mt-1">
                Rp {payout.netPayoutAmount.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Formula Math Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-300 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Total Tabungan Terverifikasi ({verifiedWeeks} Minggu)</span>
                </span>
                <span className="font-mono font-bold text-white">
                  + Rp {payout.totalSavedAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Biaya Administrasi Program</span>
                </span>
                <span className="font-mono font-bold text-slate-400">
                  - Rp {payout.adminFeeAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {bundle && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-amber-300 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Paket Barang: {bundle.name}</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    - Rp {bundle.bundlePrice.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {payout.emergencyDeductionAmount > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Total Penarikan Darurat yang Telah Dicairkan</span>
                  </span>
                  <span className="font-mono font-bold">
                    - Rp {payout.emergencyDeductionAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/paket"
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{bundle ? 'Ganti Pilihan Paket Barang' : 'Pilih Paket Sembako / Perabotan'}</span>
            </Link>
            <Link
              href="/tabunganku"
              className="text-xs text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Buka Kartu Absen 50 Minggu</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Selected Package Banner */}
      {bundle && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-400/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bundle.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
              alt={bundle.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
            />
            <div>
              <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                <ShoppingBag className="w-3 h-3" />
                <span>Paket Lebaran Pilihan Anda</span>
              </div>
              <h3 className="text-base font-bold text-white">{bundle.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{bundle.description}</p>
            </div>
          </div>
          <div className="text-right sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
            <div className="text-xs text-slate-400">Total Harga Paket:</div>
            <div className="text-lg font-bold font-mono text-amber-300">
              Rp {bundle.bundlePrice.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadProofModal
        isOpen={isUploadOpen}
        ledger={selectedLedger}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={payWeek}
      />

      <EmergencyWithdrawalModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
