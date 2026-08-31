'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ShieldCheck, Calendar, Gift, Coins, CheckCircle2 } from 'lucide-react';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';

export const HeroSection: React.FC = () => {
  // Live Countdown to Next Eid Al-Fitr (Calculated approx 50 weeks)
  const [timeLeft, setTimeLeft] = useState({
    days: 342,
    hours: 14,
    minutes: 25,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#fbbf24', '#34d399'],
    });
    const el = document.getElementById('kalkulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/40">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Program Tabungan Idul Fitri 1 Tahun Penuh</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Lebaran Tenang,{' '}
              <span className="text-gradient-gold">Nabung 100rb/Minggu</span>,{' '}
              Panen Uang & <span className="text-gradient-emerald">Paket Sembako!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Mulai dari <strong className="text-white">H+1 minggu sehabis Lebaran</strong> dan cair tepat pada{' '}
              <strong className="text-amber-300">H-1 minggu sebelum Lebaran tahun depan</strong>. Dapatkan sisa uang tunai + 
              paket sembako daging sapi segar, minyak, telur, kue kaleng, atau perabotan idaman Anda!
            </p>

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Bebas Denda Tarik Darurat</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Paket Sembako & Hampers</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">100% Transparan & Aman</span>
              </div>
            </div>

            {/* CTA & Ticker Section */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleCtaClick}
                className="w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200 text-center"
              >
                <span className="relative z-10 flex items-center justify-center text-base">
                  Simulasi Tabunganku Sekarang
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <a
                href="#timeline"
                className="w-full sm:w-auto px-6 py-4 rounded-full text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 border border-white/10 hover:bg-slate-800 transition-all text-center flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                Pelajari 50 Minggu
              </a>
            </div>

            {/* Live Eid Countdown Mini Widget */}
            <div className="pt-3">
              <div className="inline-flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-amber-400/20 backdrop-blur-xl">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Menuju Pembagian H-1 Idul Fitri:</span>
                </div>
                <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-white">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-white/10">{timeLeft.days}d</span>
                  <span>:</span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-white/10">{timeLeft.hours}h</span>
                  <span>:</span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-white/10">{timeLeft.minutes}m</span>
                  <span>:</span>
                  <span className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-amber-400">{timeLeft.seconds}s</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-emerald-500/20 p-2 sm:p-4">
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1 rounded-full bg-slate-950/85 border border-amber-400/30 text-[11px] font-medium text-amber-300 flex items-center space-x-1.5 backdrop-blur-md shadow-lg shadow-black/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Si Berkah — Maskot Celengan Emas 3D</span>
              </div>
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-950/85 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 backdrop-blur-md shadow-lg shadow-black/50">
                👆 Klik untuk Goyang • Arahkan Kursor
              </div>
              <ThreeHeroCanvas />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
