'use client';

import React, { useState } from 'react';
import { useAdminStore } from '../../../../stores/useAdminStore';
import { useToastStore } from '../../../../stores/useToastStore';
import { CheckSquare, Check, X, Eye, Phone, Calendar, Sparkles } from 'lucide-react';
import { useAutoSync } from '../../../../hooks/useAutoSync';
import { formatWeekBadge } from '../../../../lib/date-format';

export default function AdminVerifikasiPage() {
  const { pendingLedgers, verifyLedger, fetchPendingLedgers } = useAdminStore();
  const { success, warning } = useToastStore();
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  React.useEffect(() => {
    fetchPendingLedgers();
  }, [fetchPendingLedgers]);

  // Real-time background sync every 1 minute
  useAutoSync(fetchPendingLedgers, 60000);

  const handleVerify = async (id: string, approve: boolean) => {
    await verifyLedger(id, approve);
    fetchPendingLedgers();
    if (approve) {
      success('Setoran nasabah berhasil disetujui dan saldo diperbarui.');
    } else {
      warning('Setoran nasabah telah ditolak.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Verifikasi Setoran Masuk</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Antrean Verifikasi Setoran Mingguan</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Periksa foto bukti transfer setoran nasabah sebelum menyetujui penambahan saldo.
        </p>
      </div>

      {/* Table / Card List */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <h3 className="text-sm font-bold text-white">Daftar Menunggu Persetujuan</h3>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-Sync 1 Menit</span>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-mono font-semibold">{pendingLedgers.length} Antrean</span>
        </div>

        {pendingLedgers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Semua bukti transfer setoran telah selesai diverifikasi! 🎉
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pendingLedgers.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {/* Proof Thumbnail */}
                  <div
                    onClick={() => setSelectedProof(item.proofImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500')}
                    className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shrink-0 cursor-pointer group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.proofImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500'}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">{item.userName}</div>
                    <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{item.userPhone}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono mt-1">
                      {formatWeekBadge(item.weekNumber, item.dueDate)} •{' '}
                      <span className="text-amber-300 font-bold">
                        Rp {(item.amount ?? 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleVerify(item.id, false)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-white/10 transition-colors flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                  <button
                    onClick={() => handleVerify(item.id, true)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui Setoran</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Image Proof Modal Preview */}
      {selectedProof && (
        <div
          onClick={() => setSelectedProof(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-lg w-full bg-slate-900 rounded-3xl p-4 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedProof}
              alt="Bukti Transfer Penuh"
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
            <p className="text-center text-xs text-slate-400 mt-3">Klik di mana saja untuk menutup preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
