'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Power,
  Clock,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Eye,
  Save,
  HelpCircle,
} from 'lucide-react';
import { useSystemStore } from '../../../../stores/useSystemStore';
import { useToastStore } from '../../../../stores/useToastStore';

export default function AdminMaintenancePage() {
  const { maintenance, fetchStatus, updateMaintenance, isLoading } = useSystemStore();
  const { success, error, warning } = useToastStore();

  const [isMaintenance, setIsMaintenance] = useState(maintenance.isMaintenance);
  const [message, setMessage] = useState(maintenance.message);
  const [estimatedEndTime, setEstimatedEndTime] = useState(maintenance.estimatedEndTime || '');
  const [contactWhatsapp, setContactWhatsapp] = useState(maintenance.contactWhatsapp || '089988776655');

  useEffect(() => {
    fetchStatus().then((cfg) => {
      setIsMaintenance(cfg.isMaintenance);
      setMessage(cfg.message);
      setEstimatedEndTime(cfg.estimatedEndTime || '');
      setContactWhatsapp(cfg.contactWhatsapp || '089988776655');
    });
  }, [fetchStatus]);

  const handleToggleSwitch = async () => {
    const nextState = !isMaintenance;
    setIsMaintenance(nextState);

    const res = await updateMaintenance({
      isMaintenance: nextState,
      message,
      estimatedEndTime,
      contactWhatsapp,
    });

    if (res.success) {
      if (nextState) {
        warning('Mode Maintenance AKTIF! Nasabah kini diblokir dari akses aplikasi.');
      } else {
        success('Mode Maintenance DINONAKTIFKAN! Aplikasi kembali normal untuk nasabah.');
      }
    } else {
      error(res.message);
      setIsMaintenance(!nextState); // rollback
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await updateMaintenance({
      isMaintenance,
      message,
      estimatedEndTime,
      contactWhatsapp,
    });

    if (res.success) {
      success('Pengaturan pemeliharaan sistem berhasil disimpan!');
    } else {
      error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
          <Wrench className="w-3.5 h-3.5" />
          <span>System Security & Governance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Mode Pemeliharaan (Maintenance Mode)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Kontrol aksesibilitas platform secara terpusat. Ketika aktif, nasabah otomatis dialihkan ke halaman pemeliharaan sementara portal admin tetap beroperasi normal.
        </p>
      </div>

      {/* Hero Status Card */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden ${
          isMaintenance
            ? 'bg-rose-950/40 border-rose-500/40 shadow-2xl shadow-rose-950/50'
            : 'bg-emerald-950/30 border-emerald-500/30 shadow-2xl shadow-emerald-950/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                isMaintenance
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}
            >
              {isMaintenance ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isMaintenance ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {isMaintenance ? 'Maintenance Aktif' : 'Sistem Normal'}
                </span>
                <span className="text-xs text-slate-400">
                  {isMaintenance ? '• Akses Nasabah Dibatasi' : '• Akses Terbuka Penuh'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mt-1.5">
                {isMaintenance
                  ? 'Aplikasi Sedang Dalam Pemeliharaan Terjadwal'
                  : 'Aplikasi Beroperasi Normal untuk Seluruh Nasabah'}
              </h2>

              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {isMaintenance
                  ? 'Nasabah yang membuka web atau aplikasi akan melihat layar pemeliharaan dengan pesan dan kontak yang Anda atur di bawah ini.'
                  : 'Seluruh fitur nasabah (setoran mingguan, absensi, cek saldo, katalog paket) dapat diakses dengan lancar.'}
              </p>
            </div>
          </div>

          {/* Quick Toggle Action */}
          <div className="shrink-0 flex items-center space-x-3">
            <button
              type="button"
              onClick={handleToggleSwitch}
              disabled={isLoading}
              className={`py-3 px-5 rounded-2xl font-bold text-xs shadow-xl transition-all flex items-center space-x-2 cursor-pointer ${
                isMaintenance
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isMaintenance ? 'Matikan Maintenance (Buka Aplikasi)' : 'Aktifkan Mode Maintenance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Settings Form & Real-time Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-7 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-4">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Kustomisasi Tampilan & Pesan Pemeliharaan</span>
          </h3>

          <form onSubmit={handleSaveForm} className="space-y-4">
            {/* Maintenance Toggle Radio */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Status Operasional Sistem</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsMaintenance(false)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    !isMaintenance
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-md'
                      : 'bg-slate-950/40 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Normal (Aktif)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Aplikasi terbuka untuk umum & nasabah</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMaintenance(true)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                    isMaintenance
                      ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-md'
                      : 'bg-slate-950/40 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>Maintenance (Tutup)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Blokir nasabah, hanya admin yang masuk</div>
                </button>
              </div>
            </div>

            {/* Pesan Pemeliharaan */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pesan Pemeliharaan Untuk Nasabah <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contoh: Kami sedang melakukan peningkatan infrastruktur server untuk memperlancar proses tabungan Idul Fitri..."
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-colors placeholder:text-slate-600 leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Pesan ini akan tampil di layar utama nasabah saat membuka aplikasi.
              </p>
            </div>

            {/* Estimasi Selesai */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimasi Waktu Selesai (Opsional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={estimatedEndTime}
                  onChange={(e) => setEstimatedEndTime(e.target.value)}
                  placeholder="Contoh: Sabtu, 5 September 2026 pukul 15:00 WIB"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Nomor Kontak WhatsApp Admin */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor WhatsApp Bantuan Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="089988776655"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 placeholder:text-slate-600"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Nasabah dapat mengeklik tombol langsung untuk menghubungi nomor ini saat maintenance.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terapkan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Live Preview Tampilan Nasabah</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Mobile & Desktop</span>
            </div>

            {/* Simulated Mobile Mockup */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">
                  Peningkatan Layanan Tabungan Idul Fitri
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-3">
                  {message || 'Pesan pemeliharaan...'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-left text-[10px] space-y-1">
                <div className="text-slate-400">Estimasi Selesai:</div>
                <div className="text-white font-mono font-semibold">
                  {estimatedEndTime || 'Segera kembali'}
                </div>
              </div>

              <div className="w-full py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>Hubungi Pengurus WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Admin Safe-Access Guarantee Card */}
          <div className="p-5 rounded-3xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Jaminan Akses Penuh Administrator</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Anda tidak perlu khawatir terkunci. Seluruh rute Administrator (<code className="text-amber-300">/admin/*</code>) dan endpoint otentikasi login Admin tetap diizinkan secara mutlak oleh backend middleware, meskipun mode maintenance aktif 100%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
