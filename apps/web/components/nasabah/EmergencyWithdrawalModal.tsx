'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { useNasabahStore } from '../../stores/useNasabahStore';
import { useToastStore } from '../../stores/useToastStore';

interface EmergencyWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyWithdrawalModal: React.FC<EmergencyWithdrawalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { requestEmergencyWithdrawal, emergencyQuotaUsed, ledgers, program } = useNasabahStore();
  const [amount, setAmount] = useState<number>(300000);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentBalance = ledgers
    .filter((l) => l.status === 'VERIFIED')
    .reduce((sum, l) => sum + l.amount, 0);

  const maxAllowed = Math.min(500000, currentBalance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const result = requestEmergencyWithdrawal(amount, reason);
      if (result.success) {
        setSuccessMsg(result.message);
        useToastStore.getState().success('Permohonan penarikan darurat telah dikirim ke Admin untuk ditinjau.');
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(result.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Fitur Penarikan Darurat (0% Komisi)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Ajukan Penarikan Dana Darurat</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dana dapat dicairkan di luar jadwal pembagian untuk kebutuhan mendesak.
          </p>
        </div>

        {/* Guard Information Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2 mb-5">
          <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>Ketentuan Penarikan Darurat:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>Maksimal penarikan: <strong className="text-white">Rp 500.000</strong> per periode tabungan.</li>
            <li>Batas frekuensi: <strong className="text-white">1 (satu) kali</strong> penarikan seumur periode.</li>
            <li>Potongan komisi: <strong className="text-emerald-400">0% (Tanpa Denda)</strong>.</li>
            <li>Saldo terverifikasi Anda saat ini: <strong className="text-amber-300 font-mono">Rp {currentBalance.toLocaleString('id-ID')}</strong>.</li>
          </ul>
        </div>

        {emergencyQuotaUsed ? (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="text-sm font-bold text-white">Kuota Penarikan Telah Digunakan</div>
            <p className="text-xs text-slate-400">
              Anda telah menggunakan hak 1x penarikan darurat untuk periode ini. Sisa tabungan akan dibagikan penuh pada H-1 Idul Fitri.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Nominal Penarikan (Rp):</span>
                <span className="text-amber-400 font-mono font-bold">
                  Rp {amount.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={maxAllowed > 0 ? maxAllowed : 500000}
                step={25000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>Rp 50.000</span>
                <span>Maks Rp {maxAllowed.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Alasan Penarikan Darurat</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Kebutuhan mendesak berobat keluarga atau perbaikan rumah..."
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-colors placeholder:text-slate-600 resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || currentBalance <= 0}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Kirim Pengajuan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
