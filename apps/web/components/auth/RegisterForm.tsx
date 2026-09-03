'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coins, User, Lock, Phone, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password matching state
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setErrorMsg('');

    // Client-side validations
    if (password.length < 6) {
      setErrorMsg('Password harus minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setErrorMsg('Nomor WhatsApp harus terdiri dari 10 sampai 15 digit angka.');
      return;
    }

    if (!cleanPhone.startsWith('08') && !cleanPhone.startsWith('62')) {
      setErrorMsg('Nomor WhatsApp harus diawali dengan 08 atau 62.');
      return;
    }

    setIsLoading(true);

    try {
      const { ApiClient } = await import('../../lib/api-client');
      const response = await ApiClient.post('/auth/register', {
        name: name.trim(),
        phoneNumber: cleanPhone,
        email: email.trim().toLowerCase(),
        password,
        role: 'NASABAH',
        selectedNominal,
      });

      if (response.success && response.data) {
        setCredentials(response.data.user, response.data.token);
        router.push('/dashboard');
      } else {
        setErrorMsg(response.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan pada server saat pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center space-x-2 mb-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span className="text-xl font-bold font-heading text-white">
            Nabung<span className="text-amber-400">ID</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Mulai Menabung Berkah</h1>
        <p className="text-xs text-slate-400 mt-1">Daftar sekarang untuk persiapan Hari Raya Idul Fitri yang tenang</p>
      </div>

      {/* Glass Card Container */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Ahmad Arif"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nomor WhatsApp Aktif <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890 (Tidak boleh sama dengan user lain)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Digunakan untuk login dan notifikasi pengingat mingguan.</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Alamat Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmad@example.com (Tidak boleh sama dengan user lain)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password <span className="text-slate-500 text-[10px] font-normal">(Min. 6 karakter)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Konfirmasi Password</label>
              {isPasswordMatch && (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Password cocok</span>
                </span>
              )}
              {isPasswordMismatch && (
                <span className="text-[10px] text-rose-400 font-medium flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Password belum sama</span>
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password di atas"
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm focus:outline-none placeholder:text-slate-600 font-mono transition-colors ${
                  isPasswordMismatch
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : isPasswordMatch
                    ? 'border-emerald-500/60 focus:border-emerald-500'
                    : 'border-white/10 focus:border-emerald-500/60'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showConfirmPassword ? 'Sembunyikan Password' : 'Lihat Password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Program Selection Segmented */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Pilihan Target Setoran Mingguan</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { amount: 50000, label: '50rb/mg' },
                { amount: 100000, label: '100rb/mg' },
                { amount: 200000, label: '200rb/mg' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.amount}
                  onClick={() => setSelectedNominal(item.amount)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    selectedNominal === item.amount
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-950/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-slate-950 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                Saya menyetujui program tabungan 50 minggu mulai H+1 s.d. pencairan H-1 Idul Fitri beserta ketentuan penarikan darurat (Maks 500rb).
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <div className="font-semibold text-rose-200 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Pendaftaran Belum Berhasil:</span>
              </div>
              <div className="mt-1">{errorMsg}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !agreed || isPasswordMismatch}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Daftar & Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Login Link */}
      <p className="text-center text-xs text-slate-400 mt-5">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="font-semibold text-emerald-400 hover:underline">
          Masuk ke Akun
        </Link>
      </p>
    </div>
  );
};
