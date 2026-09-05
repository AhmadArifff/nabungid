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
  AlertCircle,
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
  User,
  Phone,
  Mail,
  HelpCircle,
  ShieldAlert,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react';
import { CircularProgress } from '../nasabah/CircularProgress';

export type SimulatorStep = 0 | 1 | 2;

interface StepInfo {
  id: SimulatorStep;
  number: string;
  shortTitle: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// Exactly 3 Real Customer Steps: Daftar, Login, Dashboard
const STEPS: StepInfo[] = [
  {
    id: 0,
    number: '1',
    shortTitle: 'Daftar Akun',
    title: 'Daftar Akun',
    icon: UserPlus,
    description: 'Tampilan registrasi nasabah identik dengan formulir asli.',
  },
  {
    id: 1,
    number: '2',
    shortTitle: 'Login Masuk',
    title: 'Login Masuk',
    icon: LogIn,
    description: 'Tampilan login nasabah identik dengan halaman autentikasi asli.',
  },
  {
    id: 2,
    number: '3',
    shortTitle: 'Dashboard',
    title: 'Dashboard Nasabah',
    icon: LayoutDashboard,
    description: 'Tampilan dashboard nasabah identik dengan sistem tabungan asli.',
  },
];

export const CustomerAppSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SimulatorStep>(0);
  const [is3DView, setIs3DView] = useState<boolean>(false); // DEFAULT LURUS TIDAK SUDUT 3D!
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Running auto demo loop by default!
  const [progress, setProgress] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginSuccessToast, setLoginSuccessToast] = useState<boolean>(false);

  // States mirroring the real RegisterForm
  const [registerName, setRegisterName] = useState('Ibu Siti Aminah');
  const [registerPhone, setRegisterPhone] = useState('081288776655');
  const [registerEmail, setRegisterEmail] = useState('siti.aminah@gmail.com');
  const [registerPassword, setRegisterPassword] = useState('Amanah123!');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('Amanah123!');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [registerAgreed, setRegisterAgreed] = useState(true);

  // States mirroring the real LoginForm
  const [loginRole, setLoginRole] = useState<'NASABAH' | 'ADMIN'>('NASABAH');
  const [loginMethod, setLoginMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [loginIdentifier, setLoginIdentifier] = useState('081288776655');
  const [loginPassword, setLoginPassword] = useState('Nasabah123!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // States mirroring the real Dashboard
  const [checkedInWeek36, setCheckedInWeek36] = useState(false);

  // ==========================================
  // PERSPECTIVE PHYSICS (DEFAULT 0 DEG LURUS)
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], is3DView ? [16, -2] : [0, 0]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], is3DView ? [-24, -2] : [0, 0]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DView) return;
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
  // AUTO-PLAY DEMO TIMER (6.0s PER STEP)
  // ==========================================
  const STEP_DURATION = 6000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50;
    const increment = (intervalTime / STEP_DURATION) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((curr) => {
            const next = ((curr + 1) % 3) as SimulatorStep;
            if (next === 2) {
              setLoginSuccessToast(true);
              setTimeout(() => setLoginSuccessToast(false), 2600);
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

  const handleStepSelect = (step: SimulatorStep) => {
    setCurrentStep(step);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

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
      {/* TOP BAR: NEAT 3 STEPS (ZERO TEXT WRAPPING, PROPER BUTTONS) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/95 border border-white/10 p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl shadow-xl space-y-2.5 z-20">
        {/* Row 1: Status & Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white tracking-wide">
              Demo Otomatis Aplikasi Nasabah
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
              {isPlaying ? '▶ Berjalan Otomatis' : '⏸ Dijeda'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={togglePlayPause}
              title={isPlaying ? 'Jeda Demo Otomatis' : 'Putar Demo Otomatis'}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[11px] font-medium">{isPlaying ? 'Jeda' : 'Putar'}</span>
            </button>

            {/* Optional 3D view toggle (Defaults to Lurus) */}
            <button
              onClick={() => setIs3DView((prev) => !prev)}
              title="Ubah Tampilan: Lurus (Default) atau Sudut 3D"
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                is3DView
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold">{is3DView ? 'Sudut 3D' : 'Lurus (Default)'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: 3 Step Navigation Tabs (Spacious & Zero Text Wrapping) */}
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(step.id)}
                className={`relative px-3 py-2 rounded-xl text-center transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-amber-500/20 border border-emerald-500/50 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {step.number}
                </span>
                <span className="text-xs font-bold text-white truncate">{step.shortTitle}</span>

                {/* Animated progress bar under active step */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-800 rounded-full overflow-hidden">
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
      {/* SMARTPHONE FRAME: DEFAULT LURUS (0 DEG), IDENTICAL REAL UI ELEMENTS */}
      {/* ========================================================================= */}
      <div
        style={{ perspective: is3DView ? 1400 : undefined }}
        className="relative flex justify-center items-center py-2 select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: is3DView ? 'preserve-3d' : undefined,
          }}
          className="relative w-full max-w-[420px] sm:max-w-[440px] transition-transform duration-75"
        >
          {/* Outer Straight Flagship Titanium Hardware Bezel */}
          <div className="relative rounded-[48px] p-[11px] sm:p-[13px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-[2.5px] border-slate-600/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.12)] ring-1 ring-white/20">
            {/* Inner Phone Screen */}
            <div className="relative rounded-[38px] bg-slate-950 border border-white/10 overflow-hidden flex flex-col min-h-[580px] sm:min-h-[600px] shadow-inner">
              {/* Speaker Earpiece micro-mesh slit */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-800 z-40 border-b border-white/5" />

              {/* Dynamic Island Status Bar Header */}
              <div className="pt-3 pb-2 px-6 flex items-center justify-between z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/5 shrink-0">
                <span className="text-[11px] font-bold text-white font-mono">09:41</span>

                {/* Dynamic Island Pill with Camera Lens */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-black border border-white/15 shadow-lg shadow-black/80">
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
              {/* INNER PHONE CONTENT: EXACT IDENTICAL REAL UI (DAFTAR / LOGIN / DASHBOARD) */}
              {/* =================================================================== */}
              <div className="flex-1 overflow-y-auto max-h-[520px] sm:max-h-[540px] p-3.5 sm:p-4 bg-slate-950 text-slate-100 flex flex-col justify-between">
                {/* Toast Notification on Login Success */}
                <AnimatePresence>
                  {loginSuccessToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-2.5 mb-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-xl flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Login Berhasil! Selamat Datang, Ibu Siti Aminah 👋</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {/* ========================================================= */}
                  {/* STEP 0: DAFTAR (IDENTIK PERSIS REGISTERFORM.TSX) */}
                  {/* ========================================================= */}
                  {currentStep === 0 && (
                    <motion.div
                      key="real-register"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {/* Brand Header */}
                      <div className="text-center pt-1 pb-1">
                        <div className="inline-flex items-center space-x-2 mb-1">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-md">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                              <Coins className="w-4 h-4 text-amber-400" />
                            </div>
                          </div>
                          <span className="text-base font-bold font-heading text-white">
                            Nabung<span className="text-amber-400">ID</span>
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Mulai Menabung Berkah</h2>
                        <p className="text-[10px] text-slate-400">
                          Daftar sekarang untuk persiapan Hari Raya Idul Fitri yang tenang
                        </p>
                      </div>

                      {/* Glass Card Container identik RegisterForm */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl relative overflow-hidden space-y-2.5">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

                        {/* Nama Lengkap */}
                        <div>
                          <label className="block text-[10px] font-medium text-slate-300 mb-0.5">Nama Lengkap</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={registerName}
                              placeholder="cth. Ahmad Arif"
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs placeholder:text-slate-600"
                            />
                          </div>
                        </div>

                        {/* Nomor WhatsApp */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[10px] font-medium text-slate-300">
                              Nomor WhatsApp Aktif <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[9px] text-amber-400 font-medium">Hanya Angka (0-9)</span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                              <Phone className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={registerPhone}
                              placeholder="081234567890 (Wajib angka murni)"
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-emerald-500/60 text-white text-xs font-mono tracking-wide"
                            />
                          </div>
                          <p className="text-[9px] text-emerald-400 flex items-center space-x-1 mt-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 inline shrink-0" />
                            <span>Format nomor WhatsApp valid (12 digit angka murni)</span>
                          </p>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-[10px] font-medium text-slate-300 mb-0.5">
                            Alamat Email <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="email"
                              readOnly
                              value={registerEmail}
                              placeholder="ahmad@example.com"
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs placeholder:text-slate-600"
                            />
                          </div>
                        </div>

                        {/* Password & Confirm */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-300 mb-0.5">Password</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-3 h-3" />
                              </div>
                              <input
                                type={showRegisterPassword ? 'text' : 'password'}
                                readOnly
                                value={registerPassword}
                                className="w-full pl-6 pr-6 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-[11px] font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400"
                              >
                                {showRegisterPassword ? <EyeOff className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-medium text-slate-300 mb-0.5">Konfirmasi</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-3 h-3" />
                              </div>
                              <input
                                type={showRegisterConfirmPassword ? 'text' : 'password'}
                                readOnly
                                value={registerConfirmPassword}
                                className="w-full pl-6 pr-6 py-1.5 rounded-xl bg-slate-950/60 border border-emerald-500/60 text-white text-[11px] font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400"
                              >
                                {showRegisterConfirmPassword ? <EyeOff className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Program Selection Segmented Buttons */}
                        <div>
                          <label className="block text-[10px] font-medium text-slate-300 mb-1">
                            Pilihan Target Setoran Mingguan
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { amount: 50000, label: '50rb/mg' },
                              { amount: 100000, label: '100rb/mg' },
                              { amount: 200000, label: '200rb/mg' },
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.amount}
                                onClick={() => setSelectedNominal(item.amount)}
                                className={`py-1.5 px-1 rounded-xl text-[10px] font-semibold border transition-all text-center ${
                                  selectedNominal === item.amount
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                                    : 'bg-slate-950/40 border-white/10 text-slate-400'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Terms Agreement Checkbox */}
                        <div>
                          <label className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={registerAgreed}
                              readOnly
                              className="mt-0.5 rounded border-white/20 bg-slate-950 text-emerald-500 text-xs"
                            />
                            <span className="text-[9px] text-slate-400 leading-tight">
                              Saya menyetujui program tabungan 50 minggu mulai H+1 s.d. pencairan H-1 Idul Fitri.
                            </span>
                          </label>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() => handleStepSelect(1)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <span>Daftar Akun Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Register Footer */}
                      <p className="text-center text-[10px] text-slate-400">
                        Sudah punya akun?{' '}
                        <button
                          onClick={() => handleStepSelect(1)}
                          className="font-semibold text-emerald-400 hover:underline"
                        >
                          Masuk Sekarang
                        </button>
                      </p>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* STEP 1: LOGIN (IDENTIK PERSIS LOGINFORM.TSX) */}
                  {/* ========================================================= */}
                  {currentStep === 1 && (
                    <motion.div
                      key="real-login"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      {/* Brand Header */}
                      <div className="text-center pt-1 pb-1">
                        <div className="inline-flex items-center space-x-2 mb-1">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-md">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                              <Coins className="w-4 h-4 text-amber-400" />
                            </div>
                          </div>
                          <span className="text-base font-bold font-heading text-white">
                            Nabung<span className="text-amber-400">ID</span>
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
                        <p className="text-[10px] text-slate-400">
                          Masuk ke akun Anda untuk memantau tabungan Idul Fitri
                        </p>
                      </div>

                      {/* Glass Card Container identik LoginForm */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl relative overflow-hidden space-y-3">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                        {/* Role Segmented Preset identik LoginForm */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-0.5">
                            <span>Pilih Akun Demo / Peran Masuk:</span>
                            <span className="text-amber-400 font-semibold flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>1-Click Preset</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setLoginRole('NASABAH');
                                setLoginIdentifier('081288776655');
                                setLoginPassword('Nasabah123!');
                              }}
                              className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                loginRole === 'NASABAH'
                                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                                  : 'text-slate-400'
                              }`}
                            >
                              <User className="w-3 h-3" />
                              <span>Demo Nasabah</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLoginRole('ADMIN');
                                setLoginIdentifier('admin@nabungid.com');
                                setLoginPassword('Admin123!');
                              }}
                              className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                loginRole === 'ADMIN'
                                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                                  : 'text-slate-400'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Demo Admin</span>
                            </button>
                          </div>
                        </div>

                        {/* Method Sub-Tabs */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-1 bg-slate-950/70 p-0.5 rounded-lg border border-white/10 text-[10px]">
                              <button
                                type="button"
                                onClick={() => setLoginMethod('PHONE')}
                                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                                  loginMethod === 'PHONE'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'text-slate-400'
                                }`}
                              >
                                No. WhatsApp
                              </button>
                              <button
                                type="button"
                                onClick={() => setLoginMethod('EMAIL')}
                                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                                  loginMethod === 'EMAIL'
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                    : 'text-slate-400'
                                }`}
                              >
                                Email / Username
                              </button>
                            </div>
                            <span className="text-[9px] text-amber-400 font-medium">Hanya Angka (0-9)</span>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                              {loginMethod === 'PHONE' ? <Phone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={loginIdentifier}
                              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-medium text-slate-300">Password</label>
                            <span className="text-[9px] text-amber-400 flex items-center space-x-0.5">
                              <HelpCircle className="w-2.5 h-2.5" />
                              <span>Bantuan / Lupa sandi?</span>
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type={showLoginPassword ? 'text' : 'password'}
                              readOnly
                              value={loginPassword}
                              className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
                            >
                              {showLoginPassword ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={handlePerformLogin}
                          disabled={isAuthenticating}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-75"
                        >
                          {isAuthenticating ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>Memverifikasi Akun...</span>
                            </>
                          ) : (
                            <>
                              <span>Masuk Sekarang</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Login Footer */}
                      <p className="text-center text-[10px] text-slate-400">
                        Belum memiliki akun tabungan?{' '}
                        <button
                          onClick={() => handleStepSelect(0)}
                          className="font-semibold text-amber-400 hover:underline"
                        >
                          Daftar Menabung Sekarang
                        </button>
                      </p>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* STEP 2: DASHBOARD (IDENTIK PERSIS DASHBOARD/PAGE.TSX) */}
                  {/* ========================================================= */}
                  {currentStep === 2 && (
                    <motion.div
                      key="real-dashboard"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {/* Top Welcome & Eid Countdown Alert identik Dashboard */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-900/80 to-slate-900/80 border border-emerald-500/20 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <h3 className="text-xs font-bold text-white">Tabungan Berkah 50 Mgg</h3>
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                                  Ibu Siti Aminah
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 mt-0.5">
                                Target pencairan H-1 Idul Fitri 1447H • Rp 100.000 / minggu
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setCheckedInWeek36(!checkedInWeek36)}
                            className="py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] shadow flex items-center space-x-1 shrink-0"
                          >
                            <Coins className="w-3 h-3" />
                            <span>{checkedInWeek36 ? 'Lunas ✓' : 'Cek-in Mg-36'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 📇 Mini Member Stamp Card Strip identik Dashboard */}
                      <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-400/30 backdrop-blur-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="p-1 rounded-md bg-amber-400/20 text-amber-300">
                              <Calendar className="w-3 h-3" />
                            </span>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[11px] font-bold text-white">Kartu Tabungan Cek-in</span>
                                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 text-[9px] font-bold">
                                  <Flame className="w-2.5 h-2.5 fill-orange-400" />
                                  <span>35 Mg Streak</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">Auto-Sync 1m</span>
                        </div>

                        {/* 6-Week Recent Stamp Strip identik Dashboard */}
                        <div className="grid grid-cols-6 gap-1">
                          {[31, 32, 33, 34, 35, 36].map((w) => {
                            const isPast = w <= 35;
                            const isCurrent = w === 36;
                            const isVerified = isPast || (isCurrent && checkedInWeek36);

                            return (
                              <div
                                key={w}
                                className={`p-1.5 rounded-xl border text-center flex flex-col justify-between ${
                                  isVerified
                                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                    : 'bg-slate-900 border-amber-400/50 text-amber-300 ring-1 ring-amber-400/30'
                                }`}
                              >
                                <div className="text-[9px] font-bold">Mg-{w}</div>
                                <div className="my-1 flex items-center justify-center">
                                  {isVerified ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                  )}
                                </div>
                                <span className="text-[8px] font-bold">
                                  {isVerified ? 'Lunas' : 'Bayar'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Hero Stats: Balance & Progress Ring identik Dashboard */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {/* Circular Progress & Payout Projections */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3">
                          <div className="shrink-0">
                            <CircularProgress currentWeek={35} totalWeeks={50} size={110} strokeWidth={10} />
                          </div>

                          <div className="flex-1 space-y-1 text-right">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                              Proyeksi Pembagian H-1 Idul Fitri
                            </div>
                            <div className="text-xl font-black font-mono text-amber-400">
                              Rp 3.500.000
                            </div>
                            <div className="text-[10px] text-emerald-300 font-medium">
                              Total 35 Minggu Terverifikasi
                            </div>
                            <div className="text-[9px] text-slate-400">
                              Biaya Admin: Rp 0 • Paket: Sembako Daging
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Real Bottom Navigation identik BottomNav.tsx */}
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-around text-slate-400">
                  <div
                    onClick={() => setCurrentStep(2)}
                    className={`flex flex-col items-center py-0.5 px-2 rounded-xl cursor-pointer ${
                      currentStep === 2 ? 'text-amber-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Beranda</span>
                  </div>

                  <div
                    onClick={() => setCurrentStep(2)}
                    className="flex flex-col items-center py-0.5 px-2 rounded-xl cursor-pointer hover:text-white"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Tabunganku</span>
                  </div>

                  <div
                    onClick={() => setCurrentStep(2)}
                    className="flex flex-col items-center py-0.5 px-2 rounded-xl cursor-pointer hover:text-white"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Paket Barang</span>
                  </div>

                  <div
                    onClick={() => setCurrentStep(2)}
                    className="flex flex-col items-center py-0.5 px-2 rounded-xl cursor-pointer hover:text-white"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Tarik Dana</span>
                  </div>

                  <div
                    onClick={() => setCurrentStep(1)}
                    className="flex flex-col items-center py-0.5 px-2 rounded-xl cursor-pointer hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Akun</span>
                  </div>
                </div>
              </div>

              {/* Bottom Gesture Bar */}
              <div className="py-1 flex justify-center bg-slate-950">
                <div className="w-24 h-1 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Helper & Direct Link Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-400">
        <span className="flex items-center space-x-1.5">
          <Rotate3d className="w-4 h-4 text-emerald-400" />
          <span>Demo otomatis 3 alur nasabah • Posisi lurus sesuai aplikasi nyata</span>
        </span>
        <div className="flex items-center space-x-3">
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Daftar Penuh</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Login Penuh</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/dashboard"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <span>Buka Dashboard Penuh</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
