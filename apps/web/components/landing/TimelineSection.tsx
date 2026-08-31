'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Sparkles, AlertCircle, Gift, Trophy, ArrowDown } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

const TIMELINE_STEPS = [
  {
    week: 'Minggu 1',
    timing: 'H+1 Minggu Pasca Idul Fitri',
    title: 'Pendaftaran & Setoran Perdana',
    description:
      'Program tabungan tahunan resmi dibuka. Nasabah memilih program (misal 100k/minggu) dan paket barang favorit (sembako/kue/perabotan).',
    icon: Calendar,
    badge: 'Mulai',
    highlightColor: 'border-emerald-500/40 text-emerald-400',
  },
  {
    week: 'Minggu 15',
    timing: 'Bulan ke-4',
    title: 'Monitoring Progres Mingguan di PWA',
    description:
      'Nasabah dengan mudah mencatat setoran mingguan, upload bukti transfer, dan melihat progress ring terisi secara real-time.',
    icon: CheckCircle2,
    badge: 'Proses Rutin',
    highlightColor: 'border-blue-500/40 text-blue-400',
  },
  {
    week: 'Minggu 25',
    timing: 'Pertengahan Periode (Bulan ke-6)',
    title: 'Fitur Penarikan Darurat Aktif (0% Denda)',
    description:
      'Jika nasabah mengalami kebutuhan mendesak di tengah tahun, saldo dapat ditarik maksimal Rp 500.000 (1x) tanpa potongan penalti sama sekali.',
    icon: AlertCircle,
    badge: 'Safety Net',
    highlightColor: 'border-amber-500/40 text-amber-400',
  },
  {
    week: 'Minggu 48',
    timing: 'Bulan ke-11',
    title: 'Finalisasi Paket Sembako & Parcel',
    description:
      'Admin merekap seluruh data item barang dan menyiapkan pesanan daging sapi, telur, minyak goreng, dan kue kaleng dari distributor terpercaya.',
    icon: Gift,
    badge: 'Persiapan Barang',
    highlightColor: 'border-purple-500/40 text-purple-400',
  },
  {
    week: 'Minggu 50',
    timing: 'H-1 Minggu Sebelum Idul Fitri',
    title: 'Pencairan & Pembagian Akbar Hari Raya',
    description:
      'Seluruh sisa uang tunai hasil tabungan diserahkan ke nasabah bersamaan dengan 1 paket sembako/kue/perabotan lengkap untuk menyambut Hari Raya Idul Fitri!',
    icon: Trophy,
    badge: 'Pencairan Berkah',
    highlightColor: 'border-amber-400 text-amber-300 shadow-lg shadow-amber-400/20',
  },
];

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Siklus 1 Tahun Hijriah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Perjalanan 50 Minggu: <span className="text-gradient-gold">H+1 ke H-1 Idul Fitri</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Alur waktu yang transparan dan terstruktur agar Anda bisa mempersiapkan Hari Raya dengan tenang tanpa beban
            finansial mendadak.
          </p>
        </div>

        {/* Timeline Visualizer */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line (Desktop/Tablet) */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-emerald-500 via-amber-400 to-emerald-400 opacity-40" />

          {/* Timeline Steps */}
          <div className="space-y-12 relative">
            {TIMELINE_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              const IconComp = step.icon;

              return (
                <div
                  key={step.week}
                  className={`flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } gap-6 md:gap-12 relative`}
                >
                  {/* Center Node Indicator */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Card Content (half width on desktop) */}
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <TiltCard className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 hover:border-amber-400/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border ${step.highlightColor}`}>
                          {step.week} • {step.timing}
                        </span>
                        <IconComp className="w-5 h-5 text-amber-400" />
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.description}</p>
                    </TiltCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
