'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coins, User, ShieldCheck, ArrowRight, Lock, Phone, Eye, EyeOff, Sparkles, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'NASABAH' | 'ADMIN'>('NASABAH');
  const [phoneOrEmail, setPhoneOrEmail] = useState('081234567890');
  const [password, setPassword] = useState('Nasabah123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { ApiClient } = await import('../../lib/api-client');
      const response = await ApiClient.post('/auth/login', {
        identifier: phoneOrEmail,
        password,
      });

      if (response.success && response.data) {
        setCredentials(response.data.user, response.data.token);

        if (response.data.user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(response.message || 'Login gagal. Periksa kembali username, email, atau password Anda.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan pada server saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: 'NASABAH' | 'ADMIN') => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'NASABAH') {
      setPhoneOrEmail('081234567890');
      setPassword('Nasabah123!');
    } else {
      setPhoneOrEmail('admin@nabungid.com');
      setPassword('Admin123!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-bold font-heading text-white">
            Nabung<span className="text-amber-400">ID</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h1>
        <p className="text-sm text-slate-400 mt-1">Masuk ke akun Anda untuk memantau tabungan Idul Fitri</p>
      </div>

      {/* Glass Card Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Role Segmented Switcher & Quick Demo Preset */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
            <span>Pilih Akun Demo / Peran Masuk:</span>
            <span className="text-amber-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>1-Click Preset</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10">
            <button
              type="button"
              onClick={() => handleQuickDemo('NASABAH')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'NASABAH'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Demo Nasabah</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {selectedRole === 'NASABAH'
                ? 'Username, Email, atau No. WhatsApp'
                : 'Email, Username, atau No. WA Admin'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder={selectedRole === 'NASABAH' ? '081234567890 / ahmad@example.com' : 'admin@nabungid.com'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <a
                href="https://wa.me/6289988776655?text=Halo%20Admin%20NabungID,%20saya%20lupa%20password%20akun%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
              >
                <HelpCircle className="w-3 h-3 inline" />
                <span>Bantuan / Lupa sandi?</span>
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-colors placeholder:text-slate-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <div className="font-semibold text-rose-200">Gagal Masuk:</div>
              <div>{errorMsg}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-6 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Register Link */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Belum memiliki akun tabungan?{' '}
        <Link href="/register" className="font-semibold text-amber-400 hover:underline">
          Daftar Menabung Sekarang
        </Link>
      </p>
    </div>
  );
};
