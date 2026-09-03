'use client';

import React from 'react';
import { useNasabahStore } from '../../../stores/useNasabahStore';
import { useAdminStore } from '../../../stores/useAdminStore';
import { ShoppingBag, CheckCircle2, Sparkles, Check } from 'lucide-react';
import { PackageBundle } from '@nabungid/shared';

export default function PaketPage() {
  const { bundle: selectedBundle, selectBundle } = useNasabahStore();
  const { bundles, fetchMasterData } = useAdminStore();

  React.useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-1">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Katalog Pilihan Paket Hari Raya</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Pilih Paket Barang & Sembako Lebaran</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Harga paket akan otomatis dipotong dari saldo tabungan akhir saat pembagian H-1 Idul Fitri.
        </p>
      </div>

      {bundles.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/60 border border-white/10">
          Belum ada katalog paket barang atau sembako yang aktif saat ini.
        </div>
      ) : (
        /* Package Options Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundles.map((item) => {
          const isSelected = selectedBundle?.id === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden relative ${
                isSelected
                  ? 'bg-slate-900 border-amber-400/60 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center space-x-1 shadow-lg">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Paket Terpilih</span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
                    <span className="text-xs text-slate-400">Total Harga Paket:</span>
                    <span className="text-lg font-black font-mono text-amber-400">
                      Rp {item.bundlePrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => selectBundle(isSelected ? null : item)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                        : 'bg-slate-800 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Paket Terpilih</span>
                      </>
                    ) : (
                      <span>Pilih Paket Ini</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
