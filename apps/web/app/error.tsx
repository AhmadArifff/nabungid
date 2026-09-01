'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Structured client logging
    console.error('[NabungID ErrorBoundary Captured Exception]:', {
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient red/amber glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Terjadi Kendala Teknis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mohon maaf, sistem mengalami gangguan saat memproses tampilan ini. Saldo dan data tabungan Anda tetap aman.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Muat Ulang / Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Technical Details Accordion (for dev/debugging) */}
        <div className="pt-4 border-t border-white/10 text-left">
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between w-full transition-colors cursor-pointer"
          >
            <span>Informasi Detail Diagnosa Sistem</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[10px] text-rose-300/90 break-all space-y-1">
              <div>
                <strong>Pesan:</strong> {error?.message || 'Unknown Exception'}
              </div>
              {error?.digest && (
                <div>
                  <strong>Digest ID:</strong> {error.digest}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
