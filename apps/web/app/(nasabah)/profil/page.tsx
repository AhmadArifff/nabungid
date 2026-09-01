'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToastStore } from '../../../stores/useToastStore';
import { User, Phone, Mail, MapPin, CreditCard, ShieldCheck, Save } from 'lucide-react';

export default function ProfilPage() {
  const { user, updateProfile } = useAuthStore();
  const { success } = useToastStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bankName, setBankName] = useState('BCA Syariah');
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [accountHolder, setAccountHolder] = useState(user?.name || 'Ahmad Arif');
  const [address, setAddress] = useState('Jl. Merdeka No. 45, Jakarta Selatan');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phoneNumber: phone, email });
    success('Perubahan data profil dan rekening berhasil disimpan!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Pengaturan Akun & Rekening</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profil Nasabah</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pastikan nomor WhatsApp dan data rekening Anda sesuai untuk pencairan H-1 Idul Fitri.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>Data Identitas Diri</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Domisili (Pengambilan Paket)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Rekening Pencairan Dana H-1 Lebaran</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Bank / E-Wallet</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              >
                <option value="BCA Syariah">BCA Syariah</option>
                <option value="Bank Syariah Indonesia (BSI)">BSI</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank BRI">Bank BRI</option>
                <option value="Bank BCA">Bank BCA</option>
                <option value="GoPay / OVO / DANA">E-Wallet (GoPay/DANA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nomor Rekening / HP</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </form>
    </div>
  );
}
