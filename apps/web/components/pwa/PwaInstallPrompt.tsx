'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already installed / in standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Check dismissal cookie/localstorage
    const dismissedUntil = localStorage.getItem('nabungid_pwa_dismissed');
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Standard BeforeInstallPrompt for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 2 seconds for a natural onboarding feel
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On iOS Safari, display after 3 seconds if not standalone
    if (isIosDevice && !isStandaloneMode) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        useToastStore.getState().success('Terima kasih telah memasang aplikasi NabungID!');
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 5 days
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 5);
    localStorage.setItem('nabungid_pwa_dismissed', expiry.toISOString());
  };

  if (isStandalone || !isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && !showIosGuide && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-md bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-white print:hidden"
          >
            {/* Top decorative aura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center space-x-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon.svg"
                  alt="NabungID App"
                  className="w-12 h-12 rounded-2xl p-1 bg-slate-950 border border-emerald-500/30 shadow-md shrink-0 object-contain"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">Pasang Aplikasi NabungID</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      PWA
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                    Akses instan buku tabungan mingguan & bebas lemot dari layar utama HP Anda.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                aria-label="Tutup"
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
              <button
                onClick={handleDismiss}
                className="py-2 px-3 text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Nanti Saja
              </button>

              <button
                onClick={handleInstallClick}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/25 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isIos ? 'Lihat Cara Pasang di iOS' : 'Install Sekarang'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Installation Guide Modal */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-4 text-white relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Pasang di iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Buka NabungID di <strong>Safari</strong> lalu ikuti 2 langkah mudah ini:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">1. Tekan Tombol Share (Bagikan)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Ketuk ikon kotak berpanah ke atas di bagian bawah layar Safari.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">2. Pilih &apos;Add to Home Screen&apos;</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Gulir ke bawah dan ketuk <em>&apos;Tambah ke Layar Utama&apos;</em>.
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowIosGuide(false);
                  handleDismiss();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
              >
                Saya Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
