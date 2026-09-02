'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coins, User, Lock, Phone, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedNominal, setSelectedNominal] = useState<number>(100000);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { ApiClient } = await import('../../lib/api-client');
      const response = await ApiClient.post('/auth/register', {
        name,
        phoneNumber: phone,
        email: email || undefined,
        password,
        role: 'NASABAH',
      });

      if (response.success && response.data) {
        setCredentials(response.data.user, response.data.token);
        router.push('/dashboard');
      } else {
        setErrorMsg(response.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan pada server.');
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email (Opsional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 placeholder:text-slate-600"
              />
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
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center ${
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
                className="mt-0.5 rounded border-white/20 bg-slate-950 text-emerald-500 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                Saya menyetujui program tabungan 50 minggu mulai H+1 s.d. pencairan H-1 Idul Fitri beserta ketentuan penarikan darurat (Maks 500rb).
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 mt-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-red-400">
              <span className="text-xs">{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !agreed}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
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
