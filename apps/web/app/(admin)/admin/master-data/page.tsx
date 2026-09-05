'use client';

import React, { useState } from 'react';
import { useAdminStore } from '../../../../stores/useAdminStore';
import { useToastStore } from '../../../../stores/useToastStore';
import { Database, Plus, Trash2, Edit2, CheckCircle2, ShoppingBag, Package, Calendar, Search } from 'lucide-react';
import { ProductItem, PackageBundle } from '@nabungid/shared';

export default function AdminMasterDataPage() {
  const { items, bundles, programs, addProductItem, deleteProductItem, addBundle, deleteBundle, fetchMasterData } = useAdminStore();
  const { success } = useToastStore();
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'BUNDLES' | 'PROGRAMS'>('ITEMS');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // Form State for New Item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(50000);
  const [itemUnit, setItemUnit] = useState('kg');
  const [itemCategory, setItemCategory] = useState('cat-sembako');

  // Strict Numeric Input Handler for Price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setItemPrice(raw ? parseInt(raw, 10) : 0);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

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
    success(`Item "${itemName}" berhasil ditambahkan ke katalog.`);
    setItemName('');
    setItemPrice(50000);
    setIsItemModalOpen(false);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBundles = bundles.filter((bundle) =>
    bundle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 hover:brightness-110 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Produk Baru</span>
          </button>
        )}
      </div>

      {/* Segmented Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('ITEMS')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ITEMS'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Katalog Item Produk ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('BUNDLES')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'BUNDLES'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paket Bundling Lebaran ({bundles.length})
          </button>
          <button
            onClick={() => setActiveTab('PROGRAMS')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'PROGRAMS'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Program Tabungan ({programs.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari item / paket..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400/50 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Tab 1: Product Items */}
      {activeTab === 'ITEMS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/40 border border-white/5">
              Tidak ada item produk yang cocok dengan pencarian &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors">
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
                      Rp {(item.estimatedPrice ?? 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tersedia
                  </span>
                  <button
                    onClick={() => {
                      deleteProductItem(item.id);
                      success(`Item "${item.name}" berhasil dihapus.`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Hapus Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Bundles */}
      {activeTab === 'BUNDLES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredBundles.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/40 border border-white/5">
              Tidak ada paket bundling yang cocok dengan pencarian.
            </div>
          ) : (
            filteredBundles.map((bundle) => (
              <div key={bundle.id} className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{bundle.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      Paket Lebaran
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{bundle.description}</p>
                  <div className="text-base font-bold font-mono text-amber-300">
                    Rp {(bundle.bundlePrice ?? 0).toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      deleteBundle(bundle.id);
                      success(`Paket "${bundle.name}" berhasil dihapus.`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Programs */}
      {activeTab === 'PROGRAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {programs.map((program) => (
            <div key={program.id} className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{program.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    50 Minggu
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-3">{program.description || 'Program simpanan mingguan menyambut Idul Fitri.'}</div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Setoran Mingguan:</span>
                    <strong className="text-white font-mono">Rp {(program.weeklyNominal ?? 0).toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Target Total (50 Mg):</span>
                    <strong className="text-amber-300 font-mono">Rp {((program.weeklyNominal ?? 0) * (program.targetWeeks ?? 50)).toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Admin Pengelola:</span>
                    <strong className="text-emerald-400 font-mono">Rp {(program.adminFee ?? 0).toLocaleString('id-ID')}</strong>
                  </div>
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
            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Contoh: Daging Sapi 1kg / Toples Kaca"
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300">Harga (Rp)</label>
                    <span className="text-[10px] text-amber-400">Hanya Angka</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={itemPrice}
                    onChange={handlePriceChange}
                    onKeyDown={handlePriceKeyDown}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    Rp {(itemPrice ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    placeholder="kg / pouch / set"
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Kategori Produk</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="cat-sembako">Sembako Utama</option>
                  <option value="cat-perabotan">Perabotan & Dapur</option>
                  <option value="cat-kue">Kue Kering & Minuman</option>
                </select>
              </div>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 hover:brightness-110 transition-all cursor-pointer"
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
