'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  UserPlus,
  LogIn,
  LayoutDashboard,
  Gift,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Smartphone,
  Receipt,
  Beef,
  Coins,
  Clock,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Award,
} from 'lucide-react';

interface JourneyStep {
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  points: string[];
  mockupSnippet: {
    label: string;
    value: string;
    tag: string;
  };
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: '01',
    badge: 'Langkah Pertama',
    title: 'Daftar Akun Kilat (1 Menit)',
    subtitle: 'Registrasi mudah tanpa syarat rumit dan tanpa BI checking.',
    icon: UserPlus,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
    points: [
      'Cukup isi Nama Lengkap & Nomor WhatsApp aktif untuk verifikasi.',
      'Pilih nominal tabungan mingguan sesuai kemampuan (Rp 20rb, Rp 50rb, atau Rp 100rb).',
      'Akun Anda langsung aktif seketika tanpa harus menunggu verifikasi manual berhari-hari.',
    ],
    mockupSnippet: {
      label: 'Nomor WhatsApp:',
      value: '0812-xxxx-xxxx',
      tag: '✓ Terverifikasi Otomatis',
    },
  },
  {
    number: '02',
    badge: 'Langkah Kedua',
    title: 'Login Masuk Aman & Fleksibel',
    subtitle: 'Akses dashboard pribadi Anda kapan pun dan dari perangkat mana pun.',
    icon: LogIn,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/30 via-slate-900 to-slate-900',
    points: [
      'Bisa login menggunakan Nomor WhatsApp maupun alamat Email.',
      'Dilengkapi tombol Show/Hide Password untuk kenyamanan dan keamanan input.',
      'Sesi aman terlindungi enkripsi tingkat bank, tidak ada kebocoran data privasi nasabah.',
    ],
    mockupSnippet: {
      label: 'Keamanan Sesi:',
      value: 'Enkripsi TLS 256-bit',
      tag: '🛡️ Proteksi Berlapis',
    },
  },
  {
    number: '03',
    badge: 'Langkah Ketiga',
    title: 'Kelola Tabungan di Dashboard',
    subtitle: 'Pantau saldo transparan, absensi 50 minggu, dan setor mingguan.',
    icon: LayoutDashboard,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
    points: [
      'Lihat akumulasi saldo tabungan dan grafik target pencapaian mingguan secara real-time.',
      'Setor mingguan via Transfer Bank, E-Wallet, atau Tunai dengan upload bukti setor langsung.',
      'Matrix Buku Tabungan otomatis mencentang minggu lunas dan menerbitkan kwitansi resmi ber-QR code.',
    ],
    mockupSnippet: {
      label: 'Buku 50 Minggu:',
      value: 'Matrix Otomatis Ber-QR',
      tag: '⚡ Update Real-Time',
    },
  },
  {
    number: '04',
    badge: 'Langkah Keempat',
    title: 'Panen Uang & Sembako H-1 Lebaran',
    subtitle: 'Nikmati hasil tabungan setahun penuh tepat waktu sebelum Hari Raya Idul Fitri.',
    icon: Gift,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-950/30 via-slate-900 to-slate-900',
    points: [
      'Tepat H-1 Idul Fitri, dana tabungan cair penuh + paket sembako diantar ke alamat Anda.',
      'Bebas pilih paket: Daging Sapi Segar Rendang, Parsel Sembako, Sirup, dan Kue Kaleng.',
      'Kebutuhan mendesak di tengah jalan? Ajukan penarikan dana darurat kapan saja tanpa denda!',
    ],
    mockupSnippet: {
      label: 'Hasil Tabungan:',
      value: 'Uang Tunai + Daging Sapi',
      tag: '🎉 Cair H-1 Lebaran',
    },
  },
];

export const CustomerJourneySection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <section id="panduan-nasabah" className="relative py-20 lg:py-28 bg-slate-950 border-t border-white/5 overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>PANDUAN & CARA KERJA NABUNGID</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Semudah 4 Langkah,{' '}
            <span className="text-gradient-gold">Lebaran Tenang & Bahagia</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Tidak perlu khawatir lagi uang tabungan terpakai untuk belanja harian. Di NabungID, setiap langkah dirancang
            transparan, amanah, dan mudah dipahami oleh siapa saja.
          </p>
        </div>

        {/* 4 Steps Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepIndex === idx;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? `${step.borderColor} bg-gradient-to-b ${step.bgGradient} shadow-xl shadow-black/60 scale-[1.02]`
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/90 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold font-mono text-white/30">{step.number}</span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 shadow-lg'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {step.badge}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{step.title}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.subtitle}</p>
                </div>

                {/* Micro Preview Pill inside each Card */}
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{step.mockupSnippet.label}</span>
                    <span className="text-emerald-300 font-semibold font-mono">{step.mockupSnippet.value}</span>
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium text-amber-300 flex items-center space-x-1">
                    <span>{step.mockupSnippet.tag}</span>
                  </div>
                </div>

                {/* Active bottom highlight bar */}
                {isSelected && (
                  <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Deep Dive Spotlight for the Selected Step */}
        <motion.div
          key={activeStep.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Detailed Points */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-semibold border border-amber-400/20">
                <span>Tahap {activeStep.number} Terperinci:</span>
                <strong className="text-white">{activeStep.title}</strong>
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Kenapa Nasabah Merasa Aman & Nyaman di Tahap Ini?
              </h4>

              <div className="space-y-3">
                {activeStep.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-200 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-full font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 shadow-lg shadow-emerald-950/50 flex items-center space-x-2 transition-all text-xs sm:text-sm"
                >
                  <span>Daftar Akun Sekarang (Gratis)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#kalkulator"
                  className="px-6 py-3 rounded-full text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 text-xs sm:text-sm font-semibold transition-colors border border-white/10 flex items-center space-x-2"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Coba Hitung Tabungan</span>
                </a>
              </div>
            </div>

            {/* Right: Key Benefit Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-5 bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Garansi 100% Amanah</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    NabungID Certified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">Jadwal Setoran:</span>
                    <strong className="text-white">Tiap Minggu (50 Minggu Penuh)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">Pemberitahuan:</span>
                    <strong className="text-emerald-300">WhatsApp Reminder Otomatis</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">Waktu Pembagian:</span>
                    <strong className="text-amber-300">Tepat H-1 Sebelum Idul Fitri</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">Tarik Darurat:</span>
                    <strong className="text-white">Bisa Kapan Saja Bebas Denda</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Sudah lebih dari ratusan keluarga merasakan nikmatnya Lebaran tanpa beban finansial bersama sistem
                    NabungID.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
