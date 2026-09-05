'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Sparkles, Check, Info, ShieldAlert, ArrowRight, Wallet, Gift, Receipt } from 'lucide-react';
import { useCalculatorStore } from '../../stores/useCalculatorStore';
import { SlidingNumber } from '../ui/SlidingNumber';
import { TiltCard } from '../ui/TiltCard';

const PRESET_NOMINALS = [25000, 50000, 100000, 200000, 300000];

const SAMPLE_PACKAGES = [
  { id: 'pkg-0', name: 'Tanpa Paket (Uang Saja)', price: 0, desc: 'Murni seluruh hasil tabungan dicairkan uang tunai' },
  { id: 'pkg-1', name: 'Paket Sembako Berkah', price: 250000, desc: 'Minyak 2L, Beras 5kg, Telur 1 Tray, Sirup' },
  { id: 'pkg-2', name: 'Paket Daging & Kue Kaleng', price: 450000, desc: 'Daging Sapi 1kg, Biskuit Khong Guan, Minyak, Sirup' },
  { id: 'pkg-3', name: 'Paket Perabotan & Sembako', price: 600000, desc: 'Wajan Granit 32cm, Toples Kaca, Beras 5kg, Daging 1kg' },
];

export const InteractiveCalculator: React.FC = () => {
  const {
    weeklyNominal,
    selectedPackagePrice,
    emergencyWithdrawalAmount,
    simulation,
    setWeeklyNominal,
    setPackagePrice,
    setEmergencyWithdrawal,
  } = useCalculatorStore();

  return (
    <section id="kalkulator" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulasi Perhitungan Real-Time</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Kalkulator Tabungan & <span className="text-gradient-gold">Bawa Pulang Hasilnya!</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Geser nominal mingguan, pilih paket sembako/hampers yang Anda inginkan, dan lihat transparansi uang tunai yang
            akan Anda terima tepat pada <strong className="text-amber-300">H-1 minggu sebelum Idul Fitri</strong>.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            {/* Control 1: Weekly Nominal Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Nominal Setoran Mingguan:</span>
                </label>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                    <SlidingNumber value={weeklyNominal} prefix="Rp " />
                  </span>
                  <span className="text-xs text-slate-400 block">/ minggu (50 minggu)</span>
                </div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min={25000}
                max={500000}
                step={25000}
                value={weeklyNominal}
                onChange={(e) => setWeeklyNominal(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-slate-400 self-center mr-1">Pilihan Cepat:</span>
                {PRESET_NOMINALS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setWeeklyNominal(preset)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                      weeklyNominal === preset
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    Rp {((preset ?? 0) / 1000).toLocaleString('id-ID')}k/mgg
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Package Selection */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Pilihan Paket Barang / Sembako:</span>
                </span>
                <span className="text-xs text-amber-400">
                  {(selectedPackagePrice ?? 0) > 0 ? `Rp ${(selectedPackagePrice ?? 0).toLocaleString('id-ID')}` : 'Tanpa Barang'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackagePrice === pkg.price;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setPackagePrice(pkg.price)}
                      className={`p-3.5 text-left rounded-2xl border transition-all relative ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                          : 'bg-slate-900/50 border-white/5 hover:bg-slate-900 hover:border-white/10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-slate-950 font-bold" />
                        </div>
                      )}
                      <div className="font-semibold text-sm text-white">{pkg.name}</div>
                      <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                        {(pkg.price ?? 0) > 0 ? `Rp ${(pkg.price ?? 0).toLocaleString('id-ID')}` : 'Rp 0 (Uang Tunai Murni)'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">{pkg.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control 3: Emergency Withdrawal Simulation Toggle */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Simulasi Tarik Darurat di Tengah Tahun (Maks Rp 500k, 1x):</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Rp {(emergencyWithdrawalAmount ?? 0).toLocaleString('id-ID')}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={500000}
                step={50000}
                value={emergencyWithdrawalAmount}
                onChange={(e) => setEmergencyWithdrawal(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-[11px] text-slate-400 flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-emerald-400 shrink-0" />
                Penarikan darurat bebas potongan denda (0% fee), maksimal Rp 500.000 dan hanya dapat ditarik 1x.
              </p>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5">
            <TiltCard glowColor="rgba(245, 158, 11, 0.25)" className="glass-card-gold p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Rincian Pembagian H-1</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Siklus 50 Minggu
                </span>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Tabungan Terkumpul:</span>
                  <span className="font-mono font-semibold text-white">
                    <SlidingNumber value={simulation?.grossSavings ?? 0} prefix="Rp " />
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> Biaya Admin (1 Tahun):
                  </span>
                  <span className="font-mono text-red-400">
                    - Rp {(simulation?.adminFee ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>

                {(simulation?.selectedPackagePrice ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center">
                      <span className="text-red-400 mr-1">-</span> Nilai Paket Barang:
                    </span>
                    <span className="font-mono text-red-400">
                      - Rp {(simulation?.selectedPackagePrice ?? 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {(simulation?.emergencyWithdrawalAmount ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center">
                      <span className="text-amber-400 mr-1">-</span> Penarikan Darurat (0% denda):
                    </span>
                    <span className="font-mono text-amber-400">
                      - Rp {(simulation?.emergencyWithdrawalAmount ?? 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Payout Callout */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-xs uppercase tracking-wider font-bold text-amber-300">
                  Estimasi Uang Tunai Diterima di H-1 Lebaran:
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-inner">
                  <div className="text-3xl sm:text-4xl font-extrabold text-gradient-gold font-mono tracking-tight">
                    <SlidingNumber value={simulation.netCashReceived} prefix="Rp " />
                  </div>
                  <div className="text-xs text-emerald-300 font-medium mt-1 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    {simulation.selectedPackagePrice > 0 ? '+ 1 Paket Barang Lengkap' : '+ Pembayaran Lunas 100%'}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('rakit-parcel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                <span>Lanjut Rakit Parcel Lebaran</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
