'use client';

import React, { useState } from 'react';
import { useAdminStore } from '../../../../stores/useAdminStore';
import { ShieldAlert, Check, X, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminPenarikanPage() {
  const { pendingWithdrawals, approveWithdrawal } = useAdminStore();
  const [successToast, setSuccessToast] = useState('');

  const handleDecision = (id: string, approve: boolean) => {
    approveWithdrawal(id, approve);
    setSuccessToast(
      approve
        ? 'Penarikan darurat nasabah disetujui & dicairkan!'
        : 'Permohonan penarikan darurat ditolak.'
    );
    setTimeout(() => setSuccessToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Approval Penarikan Darurat</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Persetujuan Klaim Dana Darurat</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Periksa kecukupan saldo berjalan nasabah dan pastikan nominal tidak melebihi batas Rp 500.000.
        </p>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Pending List */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Pengajuan Penarikan Darurat</h3>
          <span className="text-xs text-rose-400 font-mono font-semibold">
            {pendingWithdrawals.length} Permohonan
          </span>
        </div>

        {pendingWithdrawals.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada permohonan penarikan darurat yang tertunda.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pendingWithdrawals.map((w) => (
              <div key={w.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{w.userName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-mono">
                      Saldo: Rp {w.currentBalance.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{w.userPhone}</span>
                  </div>

                  <div className="text-xs text-slate-300 mt-2">
                    Nominal Diminta:{' '}
                    <strong className="text-amber-400 font-mono text-sm">
                      Rp {w.amount.toLocaleString('id-ID')}
                    </strong>{' '}
                    (0% Fee)
                  </div>

                  <div className="text-xs text-slate-400 italic mt-0.5">&quot;{w.reason}&quot;</div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDecision(w.id, false)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-white/10 transition-colors flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                  <button
                    onClick={() => handleDecision(w.id, true)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Cairkan Dana</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
