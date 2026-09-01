'use client';

import React from 'react';
import { WeeklyLedgerItem } from '@nabungid/shared';
import { CheckCircle2, Clock, Upload } from 'lucide-react';

interface WeeklyLedgerGridProps {
  ledgers: WeeklyLedgerItem[];
  onOpenUpload: (ledger: WeeklyLedgerItem) => void;
}

export const WeeklyLedgerGrid: React.FC<WeeklyLedgerGridProps> = ({
  ledgers,
  onOpenUpload,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {ledgers.map((item) => {
        const isVerified = item.status === 'VERIFIED';
        const isPending = item.status === 'WAITING_VERIFICATION';
        const isUnpaid = item.status === 'PENDING_PAYMENT' || item.status === 'REJECTED';

        const dueDateObj = new Date(item.dueDate);
        const formattedDate = dueDateObj.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        });

        return (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
              isVerified
                ? 'bg-emerald-950/25 border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-950/40'
                : isPending
                ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-slate-900/60 border-white/10 hover:border-white/20'
            }`}
          >
            {/* Header / Week Number */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center space-x-1">
                <span>Mg-{item.weekNumber}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{formattedDate}</span>
            </div>

            {/* Amount */}
            <div className="text-sm font-black font-mono text-amber-300 mb-3">
              Rp {(item.amount / 1000).toFixed(0)}k
            </div>

            {/* Status & Action */}
            <div>
              {isVerified && (
                <div className="inline-flex items-center space-x-1 py-1 px-2 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold w-full justify-center">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lunas</span>
                </div>
              )}

              {isPending && (
                <div className="inline-flex items-center space-x-1 py-1 px-2 rounded-lg bg-amber-400/15 text-amber-300 text-[10px] font-bold w-full justify-center">
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Menunggu Verifikasi</span>
                </div>
              )}

              {isUnpaid && (
                <button
                  onClick={() => onOpenUpload(item)}
                  className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-[10px] font-bold transition-all flex items-center justify-center space-x-1 group"
                >
                  <Upload className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Bayar Sekarang</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
