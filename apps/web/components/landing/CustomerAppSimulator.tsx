'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  UserPlus,
  LogIn,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Gift,
  Coins,
  Receipt,
  FileCheck,
  Lock,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Beef,
  Package,
  Smartphone,
  Rotate3d,
} from 'lucide-react';

export type SimulatorStep = 0 | 1 | 2 | 3;

interface StepInfo {
  id: SimulatorStep;
  badge: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    id: 0,
    badge: 'Langkah 1',
    title: 'Daftar Akun',
    icon: UserPlus,
    description: 'Registrasi kilat 1 menit hanya dengan No. WhatsApp & Nama.',
  },
  {
    id: 1,
    badge: 'Langkah 2',
    title: 'Login Masuk',
    icon: LogIn,
    description: 'Akses aman dengan No. HP atau Email & proteksi password.',
  },
  {
    id: 2,
    badge: 'Langkah 3',
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Pantau saldo real-time, progres 50 minggu & setor mingguan.',
  },
  {
    id: 3,
    badge: 'Langkah 4',
    title: 'Fitur Unggulan',
    icon: Sparkles,
    description: 'Buku 50 minggu, paket sembako daging, kwitansi & tarik darurat.',
  },
];

export const CustomerAppSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // Interactive state inside Simulator
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'buku' | 'paket' | 'kwitansi' | 'darurat'>('buku');
  const [isSimulatedUploadSuccess, setIsSimulatedUploadSuccess] = useState<boolean>(false);

  // ==========================================
  // 3D PERSPECTIVE PHYSICS (MOUSE & GYRO TRACKING)
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 160 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-0.5, 0, 0.5], [0.18, 0.08, 0.22]), springConfig);
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, 45]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const STEP_DURATION = 6500; // 6.5s per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer with progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50;
    const increment = (intervalTime / STEP_DURATION) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((curr) => ((curr + 1) % 4) as SimulatorStep);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStep]);

  const handleStepSelect = (step: SimulatorStep) => {
    setCurrentStep(step);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col space-y-4">
      {/* Top Stepper Selector Bar */}
      <div className="bg-slate-900/90 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between gap-1 z-20">
        <div className="grid grid-cols-4 gap-1 flex-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(step.id)}
                className={`relative px-2 py-2 rounded-xl text-left transition-all duration-200 flex flex-col items-center sm:items-start ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-amber-500/15 border border-emerald-500/40 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {step.badge}
                  </span>
                </div>
                <span className="text-xs font-bold truncate mt-0.5">{step.title}</span>

                {/* Active mini progress bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Play/Pause Control Button */}
        <button
          onClick={togglePlayPause}
          title={isPlaying ? 'Jeda Simulasi Otomatis' : 'Jalankan Simulasi Otomatis'}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0 ml-1"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3D SMARTPHONE CONTAINER (PERSPECTIVE & TILT) */}
      {/* ========================================================================= */}
      <div
        style={{ perspective: 1300 }}
        className="relative flex justify-center items-center py-3 select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full max-w-[430px] sm:max-w-[450px] transition-transform duration-75"
        >
          {/* ===================================================================== */}
          {/* PHYSICAL 3D SMARTPHONE HARDWARE CHASSIS */}
          {/* ===================================================================== */}

          {/* Left Side Physical Buttons */}
          {/* Action / Mute Switch */}
          <div className="absolute -left-[5px] top-24 w-[5px] h-7 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md -z-10" />
          {/* Volume Up */}
          <div className="absolute -left-[5px] top-36 w-[5px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md -z-10" />
          {/* Volume Down */}
          <div className="absolute -left-[5px] top-52 w-[5px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md -z-10" />

          {/* Right Side Physical Button: Power / Lock */}
          <div className="absolute -right-[5px] top-40 w-[5px] h-16 bg-slate-600 rounded-r-md border-r border-slate-400 shadow-md -z-10" />

          {/* Outer Titanium Aerospace Frame (3D Depth Bezel) */}
          <div className="relative rounded-[50px] p-[11px] sm:p-[13px] bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-800 border-[2.5px] border-slate-500/90 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.18)] ring-1 ring-white/25">
            {/* Dynamic 3D Glare Sheen Reflection across Gorilla Glass */}
            <motion.div
              style={{ opacity: glareOpacity }}
              className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-30"
            />

            {/* Inner Phone Screen */}
            <div className="relative rounded-[39px] bg-slate-950 border border-white/10 overflow-hidden flex flex-col min-h-[500px] sm:min-h-[520px] shadow-2xl">
              {/* Speaker Earpiece micro-mesh slit */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-800 z-30 border-b border-white/5" />

              {/* Dynamic Island Status Bar Header */}
              <div className="pt-3.5 pb-2 px-6 flex items-center justify-between z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/5">
                <span className="text-[11px] font-bold text-white font-mono">9:41</span>

                {/* Apple / Android style Dynamic Island Pill */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-black border border-white/10 shadow-lg shadow-black/80">
                  {/* Front camera lens with blue optical coating glow */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-400 font-mono tracking-wider">
                    NabungID Mobile
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">5G</span>
                  <div className="w-3.5 h-2 rounded-sm border border-slate-400 flex items-center p-0.5">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* SCREEN CONTENT (STEP TUTORIAL VIEWS) */}
              {/* =================================================================== */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* ========================================================= */}
                  {/* VIEW 0: DAFTAR AKUN (REGISTRASI) */}
                  {/* ========================================================= */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-daftar"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Pendaftaran Nasabah</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-0.5">Mulai Menabung Hari Ini</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold">
                          Gratis Daftar
                        </span>
                      </div>

                      {/* Simulated Form Fields */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">Nama Lengkap</label>
                          <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white flex items-center justify-between">
                            <span>Ibu Siti Aminah</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Nomor WhatsApp Aktif
                          </label>
                          <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-white flex items-center justify-between shadow-sm shadow-emerald-500/10">
                            <span>0812-8877-6655</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              Valid ✓
                            </span>
                          </div>
                        </div>

                        {/* Interactive Nominal Selector Pill */}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Pilih Nominal Mingguan
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[20000, 50000, 100000].map((nom) => (
                              <button
                                key={nom}
                                type="button"
                                onClick={() => setSelectedNominal(nom)}
                                className={`py-1.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                                  selectedNominal === nom
                                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-[1.02]'
                                    : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                                }`}
                              >
                                Rp {nom.toLocaleString('id-ID')}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-amber-300/90 mt-1 flex items-center space-x-1">
                            <span>💡 Hasil 50 minggu:</span>
                            <strong className="text-white">Rp {(selectedNominal * 50).toLocaleString('id-ID')}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Submit CTA Simulator */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleStepSelect(1)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-1.5 transition-all group"
                        >
                          <span>Lanjut ke Simulasi Login</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-2">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Data aman terenkripsi • Tanpa BI Checking</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* VIEW 1: LOGIN AMAN */}
                  {/* ========================================================= */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Autentikasi Nasabah</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-0.5">Masuk ke Akun Anda</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                          Multi-Login
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Nomor WhatsApp / Email
                          </label>
                          <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white">
                            <span>0812-8877-6655</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-medium text-slate-300">Kata Sandi</label>
                            <span className="text-[10px] text-amber-300">Bantuan Lupa Sandi</span>
                          </div>
                          <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white flex items-center justify-between">
                            <span className="font-mono tracking-widest">
                              {showPassword ? 'amanah2026' : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="text-slate-400 hover:text-white transition-colors p-1"
                              title="Klik untuk coba fitur Lihat/Sembunyikan Sandi"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            👆 <em>Klik ikon mata untuk uji coba Show/Hide password.</em>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
                              ✓
                            </div>
                            <span className="text-[11px] text-slate-300">Ingat perangkat saya</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">Sesi 30 Hari</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleStepSelect(2)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center space-x-1.5 transition-all group"
                        >
                          <span>Masuk ke Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Login aman dengan enkripsi JWT token & rate-limiting</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* VIEW 2: DASHBOARD NASABAH */}
                  {/* ========================================================= */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-dashboard"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      {/* Nasabah Greeting Header */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/20">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                            SA
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Ibu Siti Aminah</div>
                            <div className="text-[10px] text-emerald-300">Siklus Idul Fitri 1447 H</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Disiplin 100%
                        </span>
                      </div>

                      {/* Main Financial Progress Card with 3D Depth */}
                      <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 shadow-lg">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Total Tabungan Terkumpul:</span>
                          <span className="text-amber-400 font-bold font-mono">
                            Rp {(selectedNominal * 35).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-300 font-semibold">Progres: Minggu 35 dari 50</span>
                            <span className="text-emerald-400 font-bold">70% Tercapai</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
                              style={{ width: '70%' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-[10px]">
                          <div>
                            <span className="text-slate-400 block">Target Akhir:</span>
                            <strong className="text-white font-mono">
                              Rp {(selectedNominal * 50).toLocaleString('id-ID')}
                            </strong>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block">Status Absensi:</span>
                            <strong className="text-emerald-300">35 Minggu Lunas</strong>
                          </div>
                        </div>
                      </div>

                      {/* Setor Minggu Ini Quick Action */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-semibold text-emerald-300">Tagihan Minggu ke-36:</div>
                          <div className="text-xs font-bold text-white font-mono">
                            Rp {selectedNominal.toLocaleString('id-ID')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsSimulatedUploadSuccess((prev) => !prev)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                            isSimulatedUploadSuccess
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow'
                          }`}
                        >
                          {isSimulatedUploadSuccess ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Diverifikasi ✓</span>
                            </>
                          ) : (
                            <>
                              <Coins className="w-3 h-3" />
                              <span>Coba Setor 👆</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleStepSelect(3)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-white/5"
                        >
                          <span>Eksplorasi Fitur Unggulan</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* VIEW 3: FITUR UNGGULAN LENGKAP */}
                  {/* ========================================================= */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-features"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Kenyamanan Tanpa Was-Was</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-0.5">Fitur Unggulan NabungID</h4>
                        </div>
                      </div>

                      {/* 4 Feature Tabs Switcher */}
                      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-semibold">
                        <button
                          onClick={() => setActiveFeatureTab('buku')}
                          className={`py-1 rounded-lg transition-all text-center ${
                            activeFeatureTab === 'buku'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Buku 50 Mgg
                        </button>
                        <button
                          onClick={() => setActiveFeatureTab('paket')}
                          className={`py-1 rounded-lg transition-all text-center ${
                            activeFeatureTab === 'paket'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Paket Daging
                        </button>
                        <button
                          onClick={() => setActiveFeatureTab('kwitansi')}
                          className={`py-1 rounded-lg transition-all text-center ${
                            activeFeatureTab === 'kwitansi'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Kwitansi QR
                        </button>
                        <button
                          onClick={() => setActiveFeatureTab('darurat')}
                          className={`py-1 rounded-lg transition-all text-center ${
                            activeFeatureTab === 'darurat'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Tarik Darurat
                        </button>
                      </div>

                      {/* Dynamic Preview for Selected Feature */}
                      <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 min-h-[140px] flex flex-col justify-center">
                        {activeFeatureTab === 'buku' && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                              <Calendar className="w-4 h-4" />
                              <span>Matrix Absensi 50 Minggu Terbuka</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Setiap pembayaran yang diverifikasi otomatis mencentang kartu minggu terkait secara hijau.
                              Bebas catatan ganda atau terselip!
                            </p>
                            <div className="flex items-center space-x-1 pt-1">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                                <span
                                  key={w}
                                  className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold flex items-center justify-center font-mono"
                                >
                                  ✓
                                </span>
                              ))}
                              <span className="text-[10px] text-slate-400 ml-1">... s/d Mgg 50</span>
                            </div>
                          </div>
                        )}

                        {activeFeatureTab === 'paket' && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                              <Beef className="w-4 h-4" />
                              <span>Paket Daging Sapi Segar & Sembako Idul Fitri</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Pilihan kombinasi sembako (Daging Rendang 2kg, Minyak Goreng, Biskuit Kaleng, Sirup) yang
                              siap diantar H-1 sebelum Hari Raya!
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-semibold">
                              Sisa uang tabungan tetap dicairkan tunai 100%!
                            </span>
                          </div>
                        )}

                        {activeFeatureTab === 'kwitansi' && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                              <Receipt className="w-4 h-4" />
                              <span>Kwitansi Digital Resmi Ber-QR Code</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Tiap setoran langsung menerbitkan bukti setor elektronik ber-QR code sah yang bisa Anda
                              unduh kapan saja sebagai bukti pembayaran resmi.
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-emerald-300 font-mono bg-emerald-950/40 px-2 py-1 rounded">
                              <span>KWT-202609-0035 • Tervalidasi Sistem</span>
                            </div>
                          </div>
                        )}

                        {activeFeatureTab === 'darurat' && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                              <ShieldCheck className="w-4 h-4" />
                              <span>Klaim Penarikan Darurat Bebas Denda</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Ada kebutuhan sakit atau mendesak sebelum lebaran? Saldo tabungan Anda tetap aman dan
                              dapat diajukan penarikan darurat tanpa denda hangus.
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold">
                              Amanah & Manusiawi untuk Nasabah
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Direct Action Link */}
                      <div className="pt-0.5">
                        <Link
                          href="/register"
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:scale-[1.01] text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <span>Daftar Sekarang & Mulai Tabungan Anda</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom In-Phone Navigation Bar */}
              <div className="px-5 py-2 bg-slate-900/90 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  {[0, 1, 2, 3].map((stepIdx) => (
                    <button
                      key={stepIdx}
                      onClick={() => handleStepSelect(stepIdx as SimulatorStep)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentStep === stepIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Langkah ${stepIdx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1 font-mono">
                    {currentStep + 1} / {STEPS.length}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleStepSelect(((currentStep - 1 + 4) % 4) as SimulatorStep)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => handleStepSelect(((currentStep + 1) % 4) as SimulatorStep)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold"
                  >
                    Lanjut
                  </button>
                </div>
              </div>

              {/* Home Indicator bar at bottom of phone */}
              <div className="py-1 flex justify-center bg-slate-950/95">
                <div className="w-28 h-1 rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* POPPING 3D FLOATING ELEMENTS IN Z-SPACE */}
          {/* ===================================================================== */}
          {/* Popping 3D Badge 1: Top Right */}
          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            className="hidden sm:flex absolute -top-3 -right-5 z-40 items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Siklus 1447 H Aktif</span>
          </motion.div>

          {/* Popping 3D Badge 2: Bottom Left */}
          <motion.div
            style={{ transform: 'translateZ(40px)' }}
            className="hidden sm:flex absolute -bottom-2 -left-5 z-40 items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Amanah & Transparan</span>
          </motion.div>

          {/* Realistic 3D Ground Floating Drop Shadow */}
          <motion.div
            style={{
              x: shadowX,
              y: shadowY,
            }}
            className="absolute -bottom-10 left-6 right-6 h-10 rounded-[100%] bg-emerald-950/60 blur-2xl -z-20 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Helper & Indicator text under 3D simulator */}
      <div className="flex items-center justify-between px-3 text-[11px] text-slate-400">
        <span className="flex items-center space-x-1.5">
          <Rotate3d className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Interaksi 3D: Gerakkan mouse / usap layar untuk efek kemiringan HP 3D</span>
        </span>
        <Link
          href="/register"
          className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
        >
          <span>Daftar Asli</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
