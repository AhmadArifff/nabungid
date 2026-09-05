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
  Home,
  ExternalLink,
  MessageSquare,
  Settings,
  Calculator,
  Bell,
  ArrowLeft,
  Check,
  TrendingUp,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';

export type SimulatorStep = 0 | 1 | 2 | 3;
export type AppViewMode = 'homescreen' | 'splash' | 'app';

interface StepInfo {
  id: SimulatorStep;
  number: string;
  shortTitle: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    id: 0,
    number: '1',
    shortTitle: 'Daftar',
    title: 'Daftar Akun',
    icon: UserPlus,
    description: 'Registrasi kilat 1 menit hanya dengan No. WhatsApp & Nama.',
  },
  {
    id: 1,
    number: '2',
    shortTitle: 'Login',
    title: 'Login Masuk',
    icon: LogIn,
    description: 'Akses aman dengan No. HP atau Email & proteksi password.',
  },
  {
    id: 2,
    number: '3',
    shortTitle: 'Dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Pantau saldo real-time, progres 50 minggu & setor mingguan.',
  },
  {
    id: 3,
    number: '4',
    shortTitle: 'Fitur',
    title: 'Fitur Unggulan',
    icon: Sparkles,
    description: 'Buku 50 minggu, paket sembako daging, kwitansi & tarik darurat.',
  },
];

export const CustomerAppSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>(0);
  const [appViewMode, setAppViewMode] = useState<AppViewMode>('app');
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Running auto-demo by default!
  const [progress, setProgress] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginSuccessToast, setLoginSuccessToast] = useState<boolean>(false);

  // Realistic Interactive Data States inside Phone
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [selectedPackageTier, setSelectedPackageTier] = useState<'hemat' | 'berkah' | 'platinum'>('platinum');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'buku' | 'paket' | 'kwitansi' | 'darurat'>('buku');
  const [isSimulatedUploadSuccess, setIsSimulatedUploadSuccess] = useState<boolean>(false);

  // ==========================================
  // 3D PERSPECTIVE PHYSICS WITH SMOOTH SPRING TILT
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], is3DView ? [16, -2] : [6, -6]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], is3DView ? [-24, -2] : [-10, 10]),
    springConfig
  );
  const shadowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], is3DView ? [30, 10] : [10, -10]),
    springConfig
  );
  const shadowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [28, 48]),
    springConfig
  );

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

  // ==========================================
  // AUTO-PLAY DEMO TIMER & TRANSITIONS (5.5s PER STEP)
  // ==========================================
  const STEP_DURATION = 5500; // 5.5 seconds per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50;
    const increment = (intervalTime / STEP_DURATION) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Auto advance to next step in the loop
          setCurrentStep((curr) => {
            const next = ((curr + 1) % 4) as SimulatorStep;
            if (next === 1) {
              // Trigger login simulation animation automatically
              setIsAuthenticating(false);
            }
            if (next === 2) {
              // Trigger success toast on entering dashboard
              setLoginSuccessToast(true);
              setTimeout(() => setLoginSuccessToast(false), 2500);
            }
            return next;
          });
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Handle user selecting step manually
  const handleStepSelect = (step: SimulatorStep) => {
    if (appViewMode !== 'app') {
      handleLaunchApp(step);
    } else {
      setCurrentStep(step);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Launch App Sequence from Homescreen
  const handleLaunchApp = (targetStep: SimulatorStep = 2) => {
    setAppViewMode('splash');
    setTimeout(() => {
      setCurrentStep(targetStep);
      setAppViewMode('app');
      setProgress(0);
    }, 750);
  };

  // Return to Phone Homescreen
  const handleReturnToHomescreen = () => {
    setAppViewMode('homescreen');
    setIsPlaying(false);
  };

  // Login button clicked inside phone screen
  const handlePerformLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setCurrentStep(2);
      setProgress(0);
      setLoginSuccessToast(true);
      setTimeout(() => setLoginSuccessToast(false), 2800);
    }, 550);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col space-y-3.5">
      {/* ========================================================================= */}
      {/* REDESIGNED TOP BAR: NEAT, SPACIOUS & NO TEXT WRAPPING */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/95 border border-white/10 p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl shadow-xl space-y-2.5 z-20">
        {/* Row 1: Header Badge & Utility Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white tracking-wide">
              Demo Otomatis Alur Nasabah
            </span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
              {isPlaying ? '▶ Berjalan Otomatis' : '⏸ Dijeda'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              title={isPlaying ? 'Jeda Demo Otomatis' : 'Putar Demo Otomatis'}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[11px] font-medium">{isPlaying ? 'Jeda' : 'Putar'}</span>
            </button>

            {/* Home HP Toggle */}
            <button
              onClick={() => setAppViewMode(appViewMode === 'homescreen' ? 'app' : 'homescreen')}
              title={appViewMode === 'homescreen' ? 'Buka Aplikasi NabungID' : 'Kembali ke Layar Utama HP'}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                appViewMode === 'homescreen'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="text-[11px]">{appViewMode === 'homescreen' ? 'Layar HP' : 'Home HP'}</span>
            </button>

            {/* 3D Angle Toggle */}
            <button
              onClick={() => setIs3DView((prev) => !prev)}
              title="Ubah Sudut Pandang 3D Smartphone"
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                is3DView
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">{is3DView ? 'Sudut 3D' : 'Lurus'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: 4 Step Navigation Tabs (Zero Awkward Wrapping) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = appViewMode === 'app' && currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(step.id)}
                className={`relative px-2 py-2 rounded-xl text-center transition-all duration-200 flex items-center justify-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-amber-500/20 border border-emerald-500/50 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {step.number}
                </span>
                <span className="text-xs font-bold text-white truncate">{step.shortTitle}</span>

                {/* Progress bar under active step */}
                {isActive && (
                  <div className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-slate-800 rounded-full overflow-hidden">
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
      </div>

      {/* ========================================================================= */}
      {/* 3D SMARTPHONE CONTAINER (TRUE 3D HARDWARE MODEL WITH PROPER REAL DATA) */}
      {/* ========================================================================= */}
      <div
        style={{ perspective: 1400 }}
        className="relative flex justify-center items-center py-2 select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full max-w-[420px] sm:max-w-[440px] transition-transform duration-75"
        >
          {/* Left Side 3D Physical Thickness Rim (Titanium Bevel Extrusion) */}
          <div
            style={{ transform: 'translateZ(-8px) rotateY(-90deg)' }}
            className="absolute -left-[14px] top-12 bottom-12 w-[14px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-l border-slate-500/40 rounded-l-md pointer-events-none"
          />

          {/* Physical Side Buttons */}
          <div className="absolute -left-[6px] top-24 w-[6px] h-7 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />
          <div className="absolute -left-[6px] top-36 w-[6px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />
          <div className="absolute -left-[6px] top-52 w-[6px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />
          <div className="absolute -right-[6px] top-40 w-[6px] h-16 bg-slate-600 rounded-r-md border-r border-slate-400 shadow-md" />

          {/* Outer Titanium Aerospace Frame */}
          <div className="relative rounded-[50px] p-[12px] sm:p-[14px] bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-800 border-[3px] border-slate-500/90 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.95),-15px_15px_30px_rgba(0,0,0,0.7),0_0_45px_rgba(16,185,129,0.2)] ring-1 ring-white/30">
            {/* Dynamic Glass Glare */}
            <div className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30" />

            {/* Inner Phone Screen */}
            <div className="relative rounded-[38px] bg-slate-950 border border-white/10 overflow-hidden flex flex-col min-h-[530px] sm:min-h-[550px] shadow-2xl">
              {/* Earpiece slit */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-800 z-40 border-b border-white/5" />

              {/* Dynamic Island Status Bar Header */}
              <div className="pt-3.5 pb-2 px-6 flex items-center justify-between z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/5">
                <span className="text-[11px] font-bold text-white font-mono">09:41</span>

                {/* Dynamic Island Pill with Camera Lens */}
                <div
                  onClick={() => setAppViewMode(appViewMode === 'homescreen' ? 'app' : 'homescreen')}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-black border border-white/15 shadow-lg shadow-black/80 cursor-pointer hover:border-emerald-500/40 transition-colors"
                  title="Ketuk Dynamic Island untuk Berpindah Layar"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-400 font-mono tracking-wider">
                    {appViewMode === 'homescreen' ? 'NabungID OS' : 'NabungID Mobile'}
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
              {/* SCREEN CONTENT: REAL DATA & INFORMATIVE CUSTOMER JOURNEY */}
              {/* =================================================================== */}
              <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-slate-950">
                {/* --------------------------------------------------------------- */}
                {/* 1. HOMESCREEN VIEW */}
                {/* --------------------------------------------------------------- */}
                {appViewMode === 'homescreen' && (
                  <motion.div
                    key="view-homescreen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950"
                  >
                    {/* Clock & Date Header */}
                    <div className="text-center pt-3 space-y-1">
                      <div className="text-4xl font-extrabold text-white tracking-tight font-mono">09:41</div>
                      <div className="text-xs text-emerald-300/80 font-medium">Sabtu, 5 September 2026</div>
                    </div>

                    {/* Lockscreen Notification Widget */}
                    <div className="my-auto space-y-4">
                      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/30 shadow-lg shadow-black/50 space-y-1.5 backdrop-blur-md">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                            <Bell className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pengingat NabungID</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Baru saja</span>
                        </div>
                        <p className="text-xs text-white leading-snug">
                          Setoran Minggu ke-36 dibuka! Segera setor Rp 100.000 agar Idul Fitri panen daging sapi & uang tunai.
                        </p>
                      </div>

                      {/* App Grid on Homescreen */}
                      <div className="pt-2">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 text-center">
                          Aplikasi Terpasang
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <button
                            onClick={() => handleLaunchApp(2)}
                            className="flex flex-col items-center group cursor-pointer"
                          >
                            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-xl shadow-emerald-900/50 group-hover:scale-110 transition-transform">
                              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                              </div>
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                                1
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-white mt-1.5 group-hover:text-amber-300 transition-colors">
                              NabungID
                            </span>
                          </button>

                          <div className="flex flex-col items-center opacity-60">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 shadow">
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1.5">WhatsApp</span>
                          </div>

                          <div className="flex flex-col items-center opacity-60">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-amber-400 shadow">
                              <Calculator className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1.5">Kalkulator</span>
                          </div>

                          <div className="flex flex-col items-center opacity-60">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shadow">
                              <Settings className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1.5">Setelan</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleLaunchApp(2)}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 animate-bounce"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Ketuk untuk Buka Aplikasi NabungID 📱</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* --------------------------------------------------------------- */}
                {/* 2. SPLASH SCREEN */}
                {/* --------------------------------------------------------------- */}
                {appViewMode === 'splash' && (
                  <motion.div
                    key="view-splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 space-y-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-1 shadow-2xl shadow-emerald-500/30 animate-pulse">
                      <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">NabungID Mobile</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Membuka Aplikasi Nasabah...</p>
                    </div>
                    <div className="w-40 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full animate-pulse w-full" />
                    </div>
                  </motion.div>
                )}

                {/* --------------------------------------------------------------- */}
                {/* 3. IN-APP SCREENS WITH REAL INFORMATIVE DATA */}
                {/* --------------------------------------------------------------- */}
                {appViewMode === 'app' && (
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative overflow-hidden">
                    {/* Toast Notification if login success */}
                    <AnimatePresence>
                      {loginSuccessToast && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute top-2 left-4 right-4 z-50 p-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-xl flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Login Berhasil! Selamat Datang, Ibu Siti Aminah 👋</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {/* ========================================================= */}
                      {/* STEP 0: DAFTAR AKUN (PROPER REAL DATA) */}
                      {/* ========================================================= */}
                      {currentStep === 0 && (
                        <motion.div
                          key="step-daftar"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
                        >
                          {/* Real Header */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Pendaftaran Idul Fitri 1447 H</span>
                              </div>
                              <h4 className="text-base font-bold text-white mt-0.5">Formulir Nasabah Baru</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              Gratis Pendaftaran
                            </span>
                          </div>

                          {/* Real Identity Inputs */}
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-0.5">Nama Lengkap Sesuai KTP</label>
                              <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white flex items-center justify-between">
                                <span>Ibu Siti Aminah, S.Pd.</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-0.5">Nomor WhatsApp Aktif (Notifikasi)</label>
                              <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-white flex items-center justify-between shadow-sm shadow-emerald-500/10">
                                <span>0812-8877-6655</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                  Terhubung WA ✓
                                </span>
                              </div>
                            </div>

                            {/* 3 Real Package Options */}
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                                Pilih Paket Tabungan Mingguan
                              </label>
                              <div className="grid grid-cols-3 gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNominal(20000);
                                    setSelectedPackageTier('hemat');
                                  }}
                                  className={`p-1.5 rounded-xl text-center transition-all ${
                                    selectedNominal === 20000
                                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                                      : 'bg-slate-900 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  <div className="text-[10px] font-semibold">Hemat</div>
                                  <div className="text-xs font-bold font-mono">20rb/mgg</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNominal(50000);
                                    setSelectedPackageTier('berkah');
                                  }}
                                  className={`p-1.5 rounded-xl text-center transition-all ${
                                    selectedNominal === 50000
                                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                                      : 'bg-slate-900 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  <div className="text-[10px] font-semibold">Berkah</div>
                                  <div className="text-xs font-bold font-mono">50rb/mgg</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNominal(100000);
                                    setSelectedPackageTier('platinum');
                                  }}
                                  className={`p-1.5 rounded-xl text-center transition-all relative ${
                                    selectedNominal === 100000
                                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                                      : 'bg-slate-900 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  <span className="absolute -top-1.5 right-1 px-1 rounded bg-rose-500 text-white text-[8px] font-bold">
                                    Favorit 🔥
                                  </span>
                                  <div className="text-[10px] font-semibold">Platinum</div>
                                  <div className="text-xs font-bold font-mono">100rb/mgg</div>
                                </button>
                              </div>

                              {/* Real Outcome Summary */}
                              <div className="mt-1.5 p-2 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Total Hasil 50 Minggu:</span>
                                <strong className="text-amber-300 font-mono font-bold text-xs">
                                  Rp {(selectedNominal * 50).toLocaleString('id-ID')} + Daging Sapi
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Submit Action */}
                          <div className="pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleStepSelect(1)}
                              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-1.5 transition-all group"
                            >
                              <span>Simulasikan Lanjut ke Login</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="mt-1.5 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Akad Wadiah Amanah • Tanpa Bunga • Tanpa Potongan Liar</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ========================================================= */}
                      {/* STEP 1: LOGIN AMAN (MASUK KE DASHBOARD) */}
                      {/* ========================================================= */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step-login"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                                <Lock className="w-3 h-3" />
                                <span>Akses Nasabah Aman</span>
                              </div>
                              <h4 className="text-base font-bold text-white mt-0.5">Masuk ke Akun Anda</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                              Multi-Login WA
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                                Nomor WhatsApp Terdaftar
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
                                  {showPassword ? 'berkah1447' : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  className="text-slate-400 hover:text-white transition-colors p-1"
                                  title="Lihat/Sembunyikan Sandi"
                                >
                                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-0.5">
                              <div className="flex items-center space-x-2">
                                <div className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
                                  ✓
                                </div>
                                <span className="text-[11px] text-slate-300">Ingat perangkat HP ini</span>
                              </div>
                              <span className="text-[10px] text-emerald-400 font-mono">Sesi 30 Hari</span>
                            </div>
                          </div>

                          {/* Login CTA */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={handlePerformLogin}
                              disabled={isAuthenticating}
                              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center space-x-1.5 transition-all group disabled:opacity-75"
                            >
                              {isAuthenticating ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                  <span>Memverifikasi Akun...</span>
                                </>
                              ) : (
                                <>
                                  <span>Masuk ke Dashboard Nasabah</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </button>
                            <div className="mt-1.5 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Enkripsi TLS 256-bit • Token JWT Aman</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ========================================================= */}
                      {/* STEP 2: DASHBOARD NASABAH (REAL PROPER FINANCIAL DATA) */}
                      {/* ========================================================= */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step-dashboard"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-2.5"
                        >
                          {/* Nasabah Header */}
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/20">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                                SA
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center space-x-1">
                                  <span>Ibu Siti Aminah</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-normal">Platinum</span>
                                </div>
                                <div className="text-[10px] text-emerald-300 font-mono">ID: NBD-1447-00358</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              100% Disiplin ✓
                            </span>
                          </div>

                          {/* Main Balance Progress Card */}
                          <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 shadow-lg">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Total Tabungan Terkumpul:</span>
                              <span className="text-amber-400 font-bold font-mono text-sm">
                                Rp {(selectedNominal * 35).toLocaleString('id-ID')}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-300 font-semibold">Minggu ke-35 dari 50</span>
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

                          {/* Setor Minggu Ini Card */}
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
                                  <span>Setor Sekarang</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* In-App Navigation Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <button
                              onClick={() => {
                                setCurrentStep(3);
                                setActiveFeatureTab('buku');
                              }}
                              className="py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-left text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between"
                            >
                              <span>Buku Absensi</span>
                              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentStep(3);
                                setActiveFeatureTab('paket');
                              }}
                              className="py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-left text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between"
                            >
                              <span>Paket Lebaran</span>
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ========================================================= */}
                      {/* STEP 3: FITUR UNGGULAN (RICH DETAILED CATALOGUE) */}
                      {/* ========================================================= */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step-features"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Katalog Fitur Lengkap</span>
                              </div>
                              <h4 className="text-base font-bold text-white mt-0.5">Keunggulan NabungID</h4>
                            </div>
                            <button
                              onClick={() => setCurrentStep(2)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Kembali</span>
                            </button>
                          </div>

                          {/* 4 Feature Tabs */}
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
                              Paket Sembako
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

                          {/* Dynamic Detailed Content */}
                          <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 min-h-[145px] flex flex-col justify-center">
                            {activeFeatureTab === 'buku' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Matrix Absensi 50 Minggu</span>
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                                    Transparan 100%
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-snug">
                                  Setiap setoran diverifikasi otomatis mencentang kartu minggu terkait. Bebas salah catat!
                                </p>
                                <div className="grid grid-cols-10 gap-1 pt-0.5">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
                                    <span
                                      key={w}
                                      className="h-4 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-bold flex items-center justify-center font-mono"
                                    >
                                      ✓
                                    </span>
                                  ))}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                                  <span>Minggu 1-35: Terbayar Lunas</span>
                                  <span className="text-amber-300">Mgg 36: Tagihan Aktif</span>
                                </div>
                              </div>
                            )}

                            {activeFeatureTab === 'paket' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                                    <Beef className="w-3.5 h-3.5" />
                                    <span>Rincian Paket Idul Fitri</span>
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold">
                                    Diantar H-1
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-300 space-y-0.5 leading-tight">
                                  <div>🥩 <strong>2 Kg Daging Sapi Segar</strong> (Grade A Rendang)</div>
                                  <div>🛢️ <strong>2 Liter Minyak Goreng</strong> Kemasan Premium</div>
                                  <div>🍪 <strong>2 Kaleng Biskuit</strong> Khong Guan / Butter Cookies</div>
                                  <div>🍾 <strong>2 Botol Sirup</strong> Marjan Cocopandan</div>
                                </div>
                                <div className="text-[9px] text-emerald-400 font-semibold pt-0.5">
                                  ✓ Sisa saldo uang tunai dicairkan penuh via transfer bank!
                                </div>
                              </div>
                            )}

                            {activeFeatureTab === 'kwitansi' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>Kwitansi Resmi Ber-QR Code</span>
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                    Sah & Terverifikasi
                                  </span>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-950 border border-white/5 text-[10px] space-y-1 font-mono">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">No:</span>
                                    <span className="text-white">KWT/2026/09/W35-088</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Nominal:</span>
                                    <span className="text-emerald-300 font-bold">Rp 100.000 (Lunas)</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Verifikator:</span>
                                    <span className="text-slate-300">Admin Keuangan (Ahmad A.)</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeFeatureTab === 'darurat' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-rose-400 font-bold flex items-center space-x-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Tarik Dana Darurat Bebas Denda</span>
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                                    0% Denda
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-300 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Saldo Anda:</span>
                                    <span className="text-white font-mono font-bold">Rp 3.500.000</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Maks. Penarikan (80%):</span>
                                    <span className="text-amber-300 font-mono font-bold">Rp 2.800.000</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Biaya Penalti:</span>
                                    <span className="text-emerald-400 font-bold">Rp 0 (Bebas Denda Sakit)</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom In-App Tab Navigation */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-around text-[10px] font-semibold text-slate-400">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className={`flex flex-col items-center space-y-0.5 ${
                          currentStep === 2 ? 'text-emerald-400 font-bold' : 'hover:text-white'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Beranda</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep(3);
                          setActiveFeatureTab('buku');
                        }}
                        className={`flex flex-col items-center space-y-0.5 ${
                          currentStep === 3 && activeFeatureTab === 'buku'
                            ? 'text-emerald-400 font-bold'
                            : 'hover:text-white'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Tabungan</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep(3);
                          setActiveFeatureTab('paket');
                        }}
                        className={`flex flex-col items-center space-y-0.5 ${
                          currentStep === 3 && activeFeatureTab === 'paket'
                            ? 'text-amber-400 font-bold'
                            : 'hover:text-white'
                        }`}
                      >
                        <Gift className="w-4 h-4" />
                        <span>Paket</span>
                      </button>

                      <button
                        onClick={() => handleReturnToHomescreen()}
                        className="flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white"
                      >
                        <Home className="w-4 h-4" />
                        <span>Keluar HP</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator Bar */}
              <div
                onClick={handleReturnToHomescreen}
                className="py-1.5 flex justify-center bg-slate-950/95 cursor-pointer hover:bg-slate-900 transition-colors"
                title="Ketuk Home Bar untuk Kembali ke Layar Utama HP"
              >
                <div className="w-28 h-1 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
              </div>
            </div>
          </div>

          {/* Popping 3D Floating Badges */}
          <motion.div
            style={{ transform: 'translateZ(50px)' }}
            className="hidden sm:flex absolute -top-4 -right-6 z-40 items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Siklus 1447 H Aktif</span>
          </motion.div>

          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            className="hidden sm:flex absolute -bottom-3 -left-6 z-40 items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Amanah & Transparan</span>
          </motion.div>

          {/* 3D Floating Drop Shadow */}
          <motion.div
            style={{
              x: shadowX,
              y: shadowY,
            }}
            className="absolute -bottom-10 left-6 right-6 h-12 rounded-[100%] bg-emerald-950/70 blur-2xl -z-20 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Helper & Direct Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5">
          <Rotate3d className="w-4 h-4 text-emerald-400" />
          <span>Demo otomatis berjalan • Gerakkan kursor untuk efek 3D HP</span>
        </span>
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Login Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Dashboard Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
