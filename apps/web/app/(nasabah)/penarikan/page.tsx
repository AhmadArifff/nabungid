'use client';

import React, { useState } from 'react';
import { useNasabahStore } from '../../../stores/useNasabahStore';
import { EmergencyWithdrawalModal } from '../../../components/nasabah/EmergencyWithdrawalModal';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

export default function PenarikanPage() {
  const { withdrawals, emergencyQuotaUsed, totalEmergencyWithdrawn, ledgers, program } = useNasabahStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentBalance = ledgers
    .filter((l) => l.status === 'VERIFIED')
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Fasilitas Penarikan Dana Darurat</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Klaim Dana Darurat</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Solusi dana cepat tanpa potongan komisi penalti (0% Fee) untuk kebutuhan mendesak.
        </p>
      </div>

      {/* Safety Shield Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Batas Maksimal Klaim:</div>
            <div className="text-lg font-black font-mono text-white">Rp 500.000</div>
            <div className="text-[10px] text-emerald-400">0% Komisi / Potongan Denda</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Status Kuota Periode:</div>
            <div className="text-sm font-bold text-amber-300">
              {emergencyQuotaUsed ? '1 / 1 (Kuota Habis)' : '0 / 1 (Tersedia)'}
            </div>
            <div className="text-[10px] text-slate-400">Maks. 1x seumur periode</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Saldo Aman Anda:</div>
            <div className="text-lg font-black font-mono text-amber-400">
              Rp {currentBalance.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400">Saldo tabungan terverifikasi</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Butuh Dana Mendesak Sebelum Idul Fitri?</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Ajukan permohonan penarikan darurat maksimal Rp 500.000. Dana akan ditransfer oleh Admin setelah permohonan diverifikasi.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={emergencyQuotaUsed || currentBalance < 50000}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0"
        >
          {emergencyQuotaUsed ? 'Kuota 1x Telah Digunakan' : 'Ajukan Penarikan Darurat'}
        </button>
      </div>

      {/* Withdrawal History Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Riwayat Pengajuan Penarikan Darurat</h3>
          <span className="text-xs text-slate-400 font-mono">{withdrawals.length} Transaksi</span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Belum ada riwayat pengajuan penarikan darurat.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {withdrawals.map((w) => {
              const isPending = w.status === 'PENDING_APPROVAL';
              const isApproved = w.status === 'APPROVED' || w.status === 'COMPLETED';
              const isRejected = w.status === 'REJECTED';

              return (
                <div key={w.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white font-mono">
                      Rp {w.amount.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{w.reason}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      {new Date(w.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div>
                    {isPending && (
                      <span className="inline-flex items-center space-x-1 py-1 px-3 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Menunggu Review Admin</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center space-x-1 py-1 px-3 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disetujui & Dicairkan</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center space-x-1 py-1 px-3 rounded-full bg-rose-500/15 text-rose-400 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EmergencyWithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
