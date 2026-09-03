'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, Sparkles, CheckCircle2, ArrowRight, Tag } from 'lucide-react';
import { useParcelStore, INITIAL_CATALOG_ITEMS } from '../../stores/useParcelStore';
import { SlidingNumber } from '../ui/SlidingNumber';
import { TiltCard } from '../ui/TiltCard';

export const ParcelBuilderSection: React.FC = () => {
  const {
    cart,
    selectedCategory,
    totalPrice,
    totalItemsCount,
    recommendedWeekly,
    setCategory,
    addItem,
    removeItem,
    clearCart,
  } = useParcelStore();

  const filteredItems =
    selectedCategory === 'all'
      ? INITIAL_CATALOG_ITEMS
      : INITIAL_CATALOG_ITEMS.filter((item) => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'sembako', label: '🥩 Sembako & Daging' },
    { id: 'snack', label: '🍪 Kue & Snack Kaleng' },
    { id: 'perabotan', label: '🍳 Perabotan Dapur' },
  ] as const;

  return (
    <section id="rakit-parcel" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Katalog Master Data Dinamis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Rakit <span className="text-gradient-emerald">Parcel Lebaran Impian</span> Anda
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Pilih daging sapi segar, telur, minyak goreng, kue kaleng, hingga wajan granit. Sistem akan menghitungkan
            rekomendasi setoran mingguan agar semua barang siap Anda terima di H-1 Idul Fitri.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Products + Cart Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Products Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const inCart = cart.find((i) => i.id === item.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <TiltCard key={item.id} className="glass-panel border border-white/10 flex flex-col justify-between group">
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-900 rounded-t-2xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                      {item.unit}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {item.name}
                      </h4>
                      <div className="text-amber-400 font-mono font-bold text-sm mt-1">
                        Rp {(item.price ?? 0).toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Add to Cart Control */}
                    <div className="pt-2">
                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item)}
                          className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-white/10 transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Tambah ke Parcel
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-slate-900 border border-emerald-500/40 rounded-xl p-1">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-red-900/60 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-emerald-400 px-2">{qty}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="p-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>

          {/* Interactive Basket Drawer (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Keranjang Parcel Anda</h3>
                </div>
                {totalItemsCount > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-red-400 text-xs flex items-center transition-colors"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Reset
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
                    <p className="text-xs">Keranjang parcel masih kosong.</p>
                    <p className="text-[11px] text-slate-500">Klik tombol &ldquo;Tambah ke Parcel&rdquo; pada katalog di samping.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-white truncate">{item.name}</div>
                        <div className="text-slate-400 text-[11px]">
                          {item.quantity} x Rp {(item.price ?? 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-amber-400">
                        Rp {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Accumulation Summary */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Nilai Barang Parcel:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    <SlidingNumber value={totalPrice ?? 0} prefix="Rp " />
                  </span>
                </div>
              </div>

              {/* Smart Recommendation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Saran Nominal Tabungan:</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-mono">
                  <SlidingNumber value={recommendedWeekly ?? 0} prefix="Rp " suffix="/mgg" />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Dengan nabung Rp {(recommendedWeekly ?? 0).toLocaleString('id-ID')}/minggu, Anda akan mendapatkan seluruh parcel di atas{' '}
                  <strong>+ sisa uang tunai ~Rp 1.000.000</strong> di H-1 Idul Fitri!
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  const el = document.getElementById('kalkulator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all text-xs active:scale-95"
              >
                <span>Terapkan ke Kalkulator Tabungan</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
