'use client';

import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode, Coins, Sparkles } from 'lucide-react';
import { WeeklyLedgerItem } from '@nabungid/shared';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  ledger: WeeklyLedgerItem | null;
  userName: string;
  userPhone: string;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  isOpen,
  ledger,
  userName,
  userPhone,
  onClose,
}) => {
  if (!isOpen || !ledger) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = `KW-1447-W${ledger.weekNumber.toString().padStart(2, '0')}-${ledger.id.slice(-4).toUpperCase()}`;
  const paidDateStr = ledger.paidDate
    ? new Date(ledger.paidDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('id-ID');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-emerald-500/30 p-6 sm:p-7 shadow-2xl overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Official Header */}
        <div className="text-center pb-5 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-2">
            <Coins className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Kwitansi Setoran Digital Sah</h2>
          <p className="text-[11px] text-amber-400 font-mono font-semibold">
            NabungID • Program Tabungan Idul Fitri 1447H
          </p>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">No. Kwitansi: {receiptNo}</div>
        </div>

        {/* Receipt Body */}
        <div className="py-4 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Telah Diterima Dari:</span>
            <span className="font-bold text-white">{userName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Nomor WhatsApp:</span>
            <span className="font-mono text-slate-300">{userPhone}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Untuk Pembayaran:</span>
            <span className="font-semibold text-amber-300">Setoran Minggu ke-{ledger.weekNumber} dari 50</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Target Jatuh Tempo:</span>
            <span className="font-mono text-slate-300">
              {(() => {
                const d = ledger.dueDate ? new Date(ledger.dueDate) : new Date('2026-04-05');
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
              })()}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Waktu Diterima Kas (paidDate):</span>
            <span className="text-emerald-400 font-mono font-bold">{paidDateStr}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Metode Penyetoran:</span>
            <span className="text-slate-300 font-mono">{ledger.paymentMethod === 'CASH' ? 'Tunai (Kas Admin)' : 'Transfer Bank / QRIS'}</span>
          </div>

          {/* Big Amount */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-center my-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Jumlah Pembayaran:</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              Rp {(ledger?.amount ?? 0).toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5 font-semibold">
              (Lunas & Terverifikasi ke Kas Tabungan)
            </span>
          </div>
        </div>

        {/* Digital Stamp Seal */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-[11px] font-bold text-white">Stempel Digital Sah</div>
              <div className="text-[9px] text-slate-400">Tervalidasi oleh Admin Pengelola NabungID</div>
            </div>
          </div>
          <div className="p-1 rounded-lg bg-white text-slate-950 font-mono text-[9px] font-bold">
            VALID
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF Kwitansi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
