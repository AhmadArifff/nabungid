'use client';

import React, { useState } from 'react';
import { useNasabahStore } from '../../../stores/useNasabahStore';
import { WeeklyLedgerGrid } from '../../../components/nasabah/WeeklyLedgerGrid';
import { UploadProofModal } from '../../../components/nasabah/UploadProofModal';
import { WeeklyLedgerItem } from '@nabungid/shared';
import { Calendar } from 'lucide-react';

export default function TabungankuPage() {
  const { ledgers, payWeek } = useNasabahStore();
  const [selectedLedger, setSelectedLedger] = useState<WeeklyLedgerItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'UNPAID'>('ALL');

  const filteredLedgers = ledgers.filter((l) => {
    if (filterStatus === 'VERIFIED') return l.status === 'VERIFIED';
    if (filterStatus === 'PENDING') return l.status === 'WAITING_VERIFICATION';
    if (filterStatus === 'UNPAID') return l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED';
    return true;
  });

  const verifiedTotal = ledgers
    .filter((l) => l.status === 'VERIFIED')
    .reduce((sum, l) => sum + l.amount, 0);

  const handleOpenUpload = (ledger: WeeklyLedgerItem) => {
    setSelectedLedger(ledger);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Riwayat 50 Minggu Tabungan</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buku Kas Setoran Mingguan</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau status verifikasi dan unggah bukti transfer setoran setiap minggu.
          </p>
        </div>

        {/* Total Verified Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Total Terverifikasi:</div>
            <div className="text-base font-black font-mono text-emerald-400">
              Rp {verifiedTotal.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { key: 'ALL', label: 'Semua Minggu (50)' },
          { key: 'VERIFIED', label: `Lunas (${ledgers.filter((l) => l.status === 'VERIFIED').length})` },
          { key: 'PENDING', label: `Menunggu (${ledgers.filter((l) => l.status === 'WAITING_VERIFICATION').length})` },
          { key: 'UNPAID', label: `Belum Bayar (${ledgers.filter((l) => l.status === 'PENDING_PAYMENT' || l.status === 'REJECTED').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterStatus === tab.key
                ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 50-Week Ledger Grid */}
      <WeeklyLedgerGrid ledgers={filteredLedgers} onOpenUpload={handleOpenUpload} />

      {/* Upload Modal */}
      <UploadProofModal
        isOpen={isUploadOpen}
        ledger={selectedLedger}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={payWeek}
      />
    </div>
  );
}
