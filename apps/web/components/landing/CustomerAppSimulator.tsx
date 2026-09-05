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
} from 'lucide-react';

export type SimulatorStep = 0 | 1 | 2 | 3;
export type AppViewMode = 'homescreen' | 'splash' | 'app';

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
  const [currentStep, setCurrentStep] = useState<SimulatorStep>(1); // Default to Login or Daftar
  const [appViewMode, setAppViewMode] = useState<AppViewMode>('app'); // 'homescreen' | 'splash' | 'app'
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Don't auto-reset while user interacts
  const [progress, setProgress] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginSuccessToast, setLoginSuccessToast] = useState<boolean>(false);

  // Interactive state inside Simulator
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'buku' | 'paket' | 'kwitansi' | 'darurat'>('buku');
  const [isSimulatedUploadSuccess, setIsSimulatedUploadSuccess] = useState<boolean>(false);

  // ==========================================
  // 3D PERSPECTIVE PHYSICS WITH DEFAULT 3D ISOMETRIC ANGLE
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 150 };
  // When in 3D view, base is tilted at [rotateX: 8, rotateY: -14], smoothly responding to mouse
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], is3DView ? [18, -2] : [8, -8]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], is3DView ? [-26, -2] : [-12, 12]),
    springConfig
  );
  const shadowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], is3DView ? [35, 10] : [15, -15]),
    springConfig
  );
  const shadowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [30, 50]),
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

  // Launch App Sequence from Homescreen (like opening real app on phone)
  const handleLaunchApp = (targetStep: SimulatorStep = 2) => {
    setAppViewMode('splash');
    setTimeout(() => {
      setCurrentStep(targetStep);
      setAppViewMode('app');
    }, 850);
  };

  // Return to Phone Homescreen
  const handleReturnToHomescreen = () => {
    setAppViewMode('homescreen');
  };

  // Login button clicked inside phone screen
  const handlePerformLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setCurrentStep(2); // Jump into Dashboard!
      setLoginSuccessToast(true);
      setTimeout(() => setLoginSuccessToast(false), 3000);
    }, 600);
  };

  const handleStepSelect = (step: SimulatorStep) => {
    if (appViewMode !== 'app') {
      handleLaunchApp(step);
    } else {
      setCurrentStep(step);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col space-y-4">
      {/* Top Controls: Mode Switcher & Stepper */}
      <div className="bg-slate-900/95 border border-white/10 p-2 rounded-2xl backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-2 z-20">
        {/* Step Selector Pills */}
        <div className="grid grid-cols-4 gap-1 flex-1 min-w-[280px]">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = appViewMode === 'app' && currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(step.id)}
                className={`relative px-2 py-2 rounded-xl text-left transition-all duration-200 flex flex-col items-center sm:items-start ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-amber-500/20 border border-emerald-500/50 text-white shadow-md'
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
              </button>
            );
          })}
        </div>

        {/* 3D Perspective Toggle & Homescreen Button */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={() => setAppViewMode(appViewMode === 'homescreen' ? 'app' : 'homescreen')}
            title={appViewMode === 'homescreen' ? 'Buka Aplikasi NabungID' : 'Kembali ke Layar Utama HP'}
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              appViewMode === 'homescreen'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{appViewMode === 'homescreen' ? 'Layar HP' : 'Home HP'}</span>
          </button>

          <button
            onClick={() => setIs3DView((prev) => !prev)}
            title="Ubah Sudut Pandang 3D Smartphone"
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              is3DView
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{is3DView ? 'Sudut 3D' : 'Hadap Depan'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D SMARTPHONE CONTAINER (TRUE 3D HARDWARE MODEL) */}
      {/* ========================================================================= */}
      <div
        style={{ perspective: 1400 }}
        className="relative flex justify-center items-center py-4 select-none"
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
          {/* ===================================================================== */}
          {/* PHYSICAL 3D SMARTPHONE CHASSIS (METAL EDGES & SIDE BUTTONS) */}
          {/* ===================================================================== */}

          {/* Left Side 3D Physical Thickness Rim (Titanium Bevel Extrusion) */}
          <div
            style={{ transform: 'translateZ(-8px) rotateY(-90deg)' }}
            className="absolute -left-[14px] top-12 bottom-12 w-[14px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-l border-slate-500/40 rounded-l-md pointer-events-none"
          />

          {/* Left Side Physical Buttons */}
          <div className="absolute -left-[6px] top-24 w-[6px] h-7 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />
          <div className="absolute -left-[6px] top-36 w-[6px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />
          <div className="absolute -left-[6px] top-52 w-[6px] h-12 bg-slate-600 rounded-l-md border-l border-slate-400 shadow-md" />

          {/* Right Side Physical Button: Power / Lock */}
          <div className="absolute -right-[6px] top-40 w-[6px] h-16 bg-slate-600 rounded-r-md border-r border-slate-400 shadow-md" />

          {/* Outer Titanium Aerospace Frame (3D Depth Bezel) */}
          <div className="relative rounded-[50px] p-[12px] sm:p-[14px] bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-800 border-[3px] border-slate-500/90 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.95),-15px_15px_30px_rgba(0,0,0,0.7),0_0_45px_rgba(16,185,129,0.2)] ring-1 ring-white/30">
            {/* Dynamic 3D Glare Sheen Reflection across Gorilla Glass */}
            <div className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30" />

            {/* Inner Phone Screen */}
            <div className="relative rounded-[38px] bg-slate-950 border border-white/10 overflow-hidden flex flex-col min-h-[520px] sm:min-h-[540px] shadow-2xl">
              {/* Speaker Earpiece micro-mesh slit */}
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
              {/* SCREEN CONTENT: 1. HOMESCREEN | 2. SPLASH | 3. IN-APP */}
              {/* =================================================================== */}
              <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-slate-950">
                {/* --------------------------------------------------------------- */}
                {/* 1. HOMESCREEN VIEW (MEMBUKA APLIKASI DARI HP) */}
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
                          Setoran Minggu ke-36 sudah dibuka! Yuk nabung Rp 100.000 agar Idul Fitri panen sembako.
                        </p>
                      </div>

                      {/* App Grid on Homescreen */}
                      <div className="pt-2">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 text-center">
                          Aplikasi Terpasang
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-center">
                          {/* Main NabungID App Icon */}
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

                          {/* Decorative Dummy System Apps */}
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

                    {/* Bottom CTA to open app */}
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
                {/* 2. APP LAUNCH SPLASH SCREEN (ANIMASI BUKA APLIKASI) */}
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
                {/* 3. IN-APP SCREENS (DAFTAR / LOGIN / DASHBOARD / FITUR) */}
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

                    {/* Active Step Content */}
                    <AnimatePresence mode="wait">
                      {/* ========================================================= */}
                      {/* STEP 0: DAFTAR AKUN (REGISTRASI) */}
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
                                <strong className="text-white">
                                  Rp {(selectedNominal * 50).toLocaleString('id-ID')}
                                </strong>
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
                              <span>Lanjut ke Halaman Login</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
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
                                <span className="text-[10px] text-amber-300">Lupa sandi?</span>
                              </div>
                              <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white flex items-center justify-between">
                                <span className="font-mono tracking-widest">
                                  {showPassword ? 'amanah2026' : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  className="text-slate-400 hover:text-white transition-colors p-1"
                                  title="Lihat / Sembunyikan Sandi"
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
                                <span className="text-[11px] text-slate-300">Ingat perangkat</span>
                              </div>
                              <span className="text-[10px] text-emerald-400 font-mono">Sesi 30 Hari</span>
                            </div>
                          </div>

                          {/* Interactive Login Action (Directly Opens Dashboard inside phone!) */}
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
                            <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Login terlindungi enkripsi token JWT</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ========================================================= */}
                      {/* STEP 2: DASHBOARD NASABAH (REALISTIC MOBILE INTERFACE) */}
                      {/* ========================================================= */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step-dashboard"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.25 }}
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
                              100% Disiplin
                            </span>
                          </div>

                          {/* Main Financial Progress Card with 3D Depth */}
                          <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 shadow-lg">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Total Tabungan:</span>
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
                                <span className="text-slate-400 block">Target 50 Mgg:</span>
                                <strong className="text-white font-mono">
                                  Rp {(selectedNominal * 50).toLocaleString('id-ID')}
                                </strong>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400 block">Absensi:</span>
                                <strong className="text-emerald-300">35 Minggu Lunas ✓</strong>
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
                                  <span>Setor Sekarang</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* In-App Quick Tabs */}
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
                      {/* STEP 3: FITUR UNGGULAN LENGKAP */}
                      {/* ========================================================= */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step-features"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
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

                          {/* Dynamic Preview for Selected Feature */}
                          <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 min-h-[140px] flex flex-col justify-center">
                            {activeFeatureTab === 'buku' && (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                                  <Calendar className="w-4 h-4" />
                                  <span>Matrix Absensi 50 Minggu Terbuka</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                  Setiap pembayaran yang diverifikasi otomatis mencentang kartu minggu terkait secara
                                  hijau. Bebas catatan ganda!
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
                                  Pilihan sembako (Daging Rendang 2kg, Minyak Goreng, Biskuit Kaleng, Sirup) yang siap
                                  diantar H-1 sebelum Lebaran!
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
                                  Tiap setoran langsung menerbitkan bukti setor elektronik ber-QR code sah yang bisa
                                  diunduh kapan saja.
                                </p>
                                <div className="flex items-center space-x-2 text-[10px] text-emerald-300 font-mono bg-emerald-950/40 px-2 py-1 rounded">
                                  <span>KWT-202609-0035 • Tervalidasi</span>
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
                                  Ada kebutuhan sakit mendesak sebelum lebaran? Saldo tabungan Anda tetap aman dan
                                  dapat ditarik darurat.
                                </p>
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold">
                                  Amanah & Manusiawi untuk Nasabah
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* In-App Mobile Bottom Navigation Bar */}
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

              {/* Bottom Home Indicator Bar (Swipe to Exit to Homescreen) */}
              <div
                onClick={handleReturnToHomescreen}
                className="py-1.5 flex justify-center bg-slate-950/95 cursor-pointer hover:bg-slate-900 transition-colors"
                title="Ketuk Home Bar untuk Kembali ke Layar Utama HP"
              >
                <div className="w-28 h-1 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* POPPING 3D FLOATING ELEMENTS IN Z-SPACE */}
          {/* ===================================================================== */}
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

          {/* Realistic 3D Ground Floating Drop Shadow */}
          <motion.div
            style={{
              x: shadowX,
              y: shadowY,
            }}
            className="absolute -bottom-10 left-6 right-6 h-12 rounded-[100%] bg-emerald-950/70 blur-2xl -z-20 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Helper & Direct Link Bar under Simulator */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5">
          <Rotate3d className="w-4 h-4 text-emerald-400" />
          <span>Bisa digerakkan kursornya untuk efek 3D HP • Ketuk tombol di layar untuk buka halaman</span>
        </span>
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Halaman Login Penuh</span>
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
