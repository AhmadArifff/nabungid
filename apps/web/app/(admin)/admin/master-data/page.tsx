'use client';

import React, { useState } from 'react';
import { useAdminStore } from '../../../../stores/useAdminStore';
import { Database, Plus, Trash2, Edit2, CheckCircle2, ShoppingBag, Package, Calendar } from 'lucide-react';
import { ProductItem, PackageBundle } from '@nabungid/shared';

export default function AdminMasterDataPage() {
  const { items, bundles, programs, addProductItem, deleteProductItem, addBundle, deleteBundle } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'BUNDLES' | 'PROGRAMS'>('ITEMS');

  // Form State for New Item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(50000);
  const [itemUnit, setItemUnit] = useState('kg');
  const [itemCategory, setItemCategory] = useState('cat-sembako');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addProductItem({
      name: itemName,
      estimatedPrice: itemPrice,
      unit: itemUnit,
      categoryId: itemCategory,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      isAvailable: true,
    });
    setItemName('');
    setIsItemModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Dynamic Master Data Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pengelolaan Master Data (Zero Hardcode)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Semua item sembako, perabotan, dan paket bundling dikelola dinamis langsung di database.
          </p>
        </div>

        {activeTab === 'ITEMS' && (
          <button
            onClick={() => setIsItemModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 hover:brightness-110 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Produk Baru</span>
          </button>
        )}
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('ITEMS')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'ITEMS'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Katalog Item Produk ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('BUNDLES')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'BUNDLES'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Paket Bundling Lebaran ({bundles.length})
        </button>
        <button
          onClick={() => setActiveTab('PROGRAMS')}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'PROGRAMS'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Program Tabungan ({programs.length})
        </button>
      </div>

      {/* Tab 1: Product Items */}
      {activeTab === 'ITEMS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.name}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Satuan: {item.unit}</div>
                  <div className="text-xs font-bold font-mono text-amber-300 mt-1">
                    Rp {item.estimatedPrice.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => deleteProductItem(item.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bundles */}
      {activeTab === 'BUNDLES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{bundle.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{bundle.description}</p>
                <div className="text-base font-bold font-mono text-amber-300">
                  Rp {bundle.bundlePrice.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => deleteBundle(bundle.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Programs */}
      {activeTab === 'PROGRAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((prog) => (
            <div key={prog.id} className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">{prog.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nominal Mingguan:</span>
                  <span className="text-amber-300 font-mono font-bold text-sm">
                    Rp {prog.weeklyNominal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Durasi:</span>
                  <span className="text-white font-mono">{prog.targetWeeks} Minggu</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Biaya Administrasi:</span>
                  <span className="text-slate-300 font-mono">Rp {prog.adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status:</span>
                  <span className="text-emerald-400 font-semibold">Aktif</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Tambah Item Produk Sembako / Perabotan</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Contoh: Daging Sapi 1kg / Toples Kaca"
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Estimasi Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    placeholder="kg / pouch / set"
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
