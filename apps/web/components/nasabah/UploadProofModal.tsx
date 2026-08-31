'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { WeeklyLedgerItem } from '@nabungid/shared';

interface UploadProofModalProps {
  isOpen: boolean;
  ledger: WeeklyLedgerItem | null;
  onClose: () => void;
  onSubmit: (weekNumber: number, proofUrl: string) => void;
}

export const UploadProofModal: React.FC<UploadProofModalProps> = ({
  isOpen,
  ledger,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen || !ledger) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      const finalUrl = previewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500';
      onSubmit(ledger.weekNumber, finalUrl);
      onClose();
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

        <div className="mb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-2">
            <span>Minggu ke-{ledger.weekNumber} dari 50</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upload Bukti Transfer Setoran</h2>
          <p className="text-xs text-slate-400 mt-1">
            Nominal setoran:{' '}
            <strong className="text-amber-300 font-mono text-sm">
              Rp {ledger.amount.toLocaleString('id-ID')}
            </strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
            <div className="text-xs font-semibold text-emerald-400">Rekening Tujuan Setoran:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Bank:</span>
                <span className="text-white font-medium">BCA Syariah / Mandiri</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">No. Rekening:</span>
                <span className="text-amber-300 font-mono font-bold">123-456-7890</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px]">Atas Nama:</span>
                <span className="text-slate-300">Pengelola Tabungan Idul Fitri</span>
              </div>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-950/40">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Bukti Transfer Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-white/10 mb-2 shadow-lg"
                />
                <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Foto Bukti Terpilih</span>
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-amber-400 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-white">Klik untuk Pilih Foto Bukti Transfer</span>
                <span className="text-[11px] text-slate-400 mt-1">Format JPG, PNG, atau WebP (Maks. 5 MB)</span>
              </div>
            )}
          </div>

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
              disabled={isUploading}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Bukti Pembayaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
