'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Sparkles,
  Check,
  Info,
  ShieldAlert,
  ArrowRight,
  Wallet,
  Gift,
  Receipt,
  ShoppingBag,
  Package,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useCalculatorStore } from '../../stores/useCalculatorStore';
import { SlidingNumber } from '../ui/SlidingNumber';
import { TiltCard } from '../ui/TiltCard';

const PRESET_NOMINALS = [25000, 50000, 100000, 200000, 300000];

interface GoodieItem {
  name: string;
  badge: string;
  qty: string;
  icon: string;
}

const PACKAGE_GOODIES: Record<number, { title: string; subtitle: string; items: GoodieItem[] }> = {
  250000: {
    title: 'Paket Sembako Berkah Lebaran',
    subtitle: 'Kebutuhan pokok dapur lengkap untuk hari raya yang berkah',
    items: [
      { name: 'Minyak Goreng Bimoli / Sania', badge: 'Kebutuhan Pokok', qty: '2 Liter Pouch', icon: '🍳' },
      { name: 'Beras Ramos Pandan Wangi', badge: 'Kualitas Super', qty: '5 Kilogram', icon: '🍚' },
      { name: 'Telur Ayam Segar Peternak', badge: 'Protein Keluarga', qty: '1 Tray (30 Btr)', icon: '🥚' },
      { name: 'Sirup Marjan Boudoin Cocopandan', badge: 'Khas Idul Fitri', qty: '2 Botol Kaca', icon: '🍾' },
      { name: 'Gula Pasir Gulaku Murni', badge: 'Manis Alami', qty: '1 Kilogram', icon: '🧂' },
    ],
  },
  450000: {
    title: 'Paket Daging Sapi & Kue Kaleng',
    subtitle: 'Rendang hari raya empuk & aneka camilan meja tamu Idul Fitri',
    items: [
      { name: 'Daging Sapi Segar Has Dalam', badge: 'Daging Pilihan', qty: '1 Kilogram (Fresh)', icon: '🥩' },
      { name: 'Biskuit Khong Guan Classic Kaleng', badge: 'Legenda Meja Tamu', qty: '1 Kaleng Besar', icon: '🍪' },
      { name: 'Minyak Goreng Premium', badge: 'Kebutuhan Pokok', qty: '2 Liter Pouch', icon: '🍳' },
      { name: 'Sirup Marjan Cocopandan', badge: 'Khas Idul Fitri', qty: '2 Botol Kaca', icon: '🍾' },
      { name: 'Kopi Kapal Api Special Mix', badge: 'Penyegar Tamu', qty: '1 Bag (20 Sachet)', icon: '☕' },
    ],
  },
  600000: {
    title: 'Paket Perabotan Dapur & Sembako',
    subtitle: 'Peralatan masak modern plus sembako lengkap sambut sanak famili',
    items: [
      { name: 'Wajan Granit Anti Lengket 32cm', badge: 'Peralatan Mewah', qty: '1 Unit + Tutup Kaca', icon: '🍳' },
      { name: 'Toples Kaca Kristal Kedap Udara', badge: 'Kue Lebaran', qty: '1 Set (3 Pcs)', icon: '🏺' },
      { name: 'Daging Sapi Segar Rendang', badge: 'Daging Pilihan', qty: '1 Kilogram', icon: '🥩' },
      { name: 'Beras Premium Super', badge: 'Kualitas Super', qty: '5 Kilogram', icon: '🍚' },
      { name: 'Minyak Goreng & Gula Murni', badge: 'Pelengkap Pokok', qty: '1 Paket Komplit', icon: '📦' },
    ],
  },
  0: {
    title: 'Pencairan 100% Uang Tunai Murni',
    subtitle: 'Seluruh tabungan dicairkan utuh ke rekening / tunai di H-1 Idul Fitri',
    items: [
      { name: 'Uang Tunai Penuh Tanpa Potongan', badge: 'Pencairan Utuh', qty: '100% Hasil Simpanan', icon: '💰' },
      { name: 'Bebas Belanja Kebutuhan Sendiri', badge: 'Fleksibilitas Penuh', qty: 'Sesuai Rencana Anda', icon: '🛍️' },
      { name: 'Transfer Instan / Terima Cash', badge: 'Aman & Bebas Riba', qty: 'Dicairkan H-1 Lebaran', icon: '🏦' },
    ],
  },
};

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

  const currentGoodies = PACKAGE_GOODIES[selectedPackagePrice] || PACKAGE_GOODIES[0];

  return (
    <section id="kalkulator" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calculator className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Simulasi Perhitungan & Parsel Nyata Real-Time</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Kalkulator Tabungan & <span className="text-gradient-gold">Bawa Pulang Hasilnya!</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Geser nominal mingguan, pilih paket sembako/hampers yang Anda inginkan, dan lihat transparansi uang tunai serta
            barang nyata yang akan Anda terima tepat pada <strong className="text-amber-300">H-1 minggu sebelum Idul Fitri</strong>.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
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
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-slate-400 self-center mr-1">Pilihan Cepat:</span>
                {PRESET_NOMINALS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeeklyNominal(preset)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      weeklyNominal === preset
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 scale-105'
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
                <span className="text-xs font-mono font-bold text-amber-400">
                  {(selectedPackagePrice ?? 0) > 0 ? `Rp ${(selectedPackagePrice ?? 0).toLocaleString('id-ID')}` : 'Tanpa Barang (Uang Murni)'}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackagePrice === pkg.price;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setPackagePrice(pkg.price)}
                      className={`p-3.5 text-left rounded-2xl border transition-all relative cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                          : 'bg-slate-900/50 border-white/5 hover:bg-slate-900 hover:border-white/10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
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

            {/* 🧺 VISUALIZER KERANJANG PARSEL LEBARAN NYATA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧺</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>{currentGoodies.title}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold">
                        Real Preview
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400">{currentGoodies.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0">
                  {selectedPackagePrice > 0 ? `Nilai: Rp ${(selectedPackagePrice ?? 0).toLocaleString('id-ID')}` : 'Uang Utuh'}
                </span>
              </div>

              {/* Grid of Real Goodie Items with smooth entry transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPackagePrice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"
                >
                  {currentGoodies.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between space-x-2 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-base shrink-0 p-1.5 rounded-lg bg-slate-950 border border-white/10">
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-white truncate">{item.name}</div>
                          <div className="text-[9px] text-slate-400">{item.badge}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Control 3: Emergency Withdrawal Simulation Toggle */}
            <div className="space-y-3 pt-3 border-t border-white/10">
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
                    {simulation.selectedPackagePrice > 0 ? '+ 1 Paket Barang Parsel Lengkap' : '+ Pembayaran Lunas 100%'}
                  </div>
                </div>
              </div>

              {/* Visual Mini Goodie Strip */}
              {selectedPackagePrice > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Barang Yang Dibawa Pulang:</span>
                    <span className="text-emerald-400">{currentGoodies.items.length} Komoditas</span>
                  </div>
                  <div className="flex items-center space-x-1 overflow-x-auto py-1">
                    {currentGoodies.items.map((item, idx) => (
                      <span
                        key={idx}
                        title={`${item.name} (${item.qty})`}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs flex items-center space-x-1 shrink-0"
                      >
                        <span>{item.icon}</span>
                        <span className="text-[10px] text-slate-200">{item.qty}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('rakit-parcel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
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
