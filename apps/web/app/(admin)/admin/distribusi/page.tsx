'use client';

import React, { useState } from 'react';
import { Gift, Download, Printer, CheckCircle2 } from 'lucide-react';
import { calculateEndCyclePayout } from '@nabungid/shared';

// Mock active member savings list for batch distribution calculation
const mockMembers = [
  { id: '1', name: 'Ahmad Arif', phone: '081234567890', totalSaved: 5000000, adminFee: 25000, bundleName: 'Paket Sembako Berkah', bundlePrice: 318000, emergencyWithdrawn: 0 },
  { id: '2', name: 'Siti Rahmawati', phone: '085711223344', totalSaved: 5000000, adminFee: 25000, bundleName: 'Paket Kue & Snack', bundlePrice: 291000, emergencyWithdrawn: 400000 },
  { id: '3', name: 'Budi Santoso', phone: '081987654321', totalSaved: 4800000, adminFee: 25000, bundleName: 'Paket Perabotan Dapur', bundlePrice: 330000, emergencyWithdrawn: 0 },
  { id: '4', name: 'Dewi Lestari', phone: '082133445566', totalSaved: 5000000, adminFee: 25000, bundleName: 'Tanpa Paket', bundlePrice: 0, emergencyWithdrawn: 500000 },
  { id: '5', name: 'Eko Prasetyo', phone: '081377889900', totalSaved: 5000000, adminFee: 25000, bundleName: 'Paket Sembako Berkah', bundlePrice: 318000, emergencyWithdrawn: 0 },
];

export default function AdminDistribusiPage() {
  const [downloadToast, setDownloadToast] = useState('');

  const payoutRows = mockMembers.map((m) => {
    const payout = calculateEndCyclePayout({
      totalSavedAmount: m.totalSaved,
      adminFeeAmount: m.adminFee,
      packageGoodsAmount: m.bundlePrice,
      emergencyDeductionAmount: m.emergencyWithdrawn,
    });
    return { ...m, payout };
  });

  const totalDisbursedCash = payoutRows.reduce((sum, r) => sum + r.payout.netPayoutAmount, 0);

  const handleExport = (type: 'EXCEL' | 'PDF') => {
    setDownloadToast(`Manifest pembagian berhasil diexport dalam format ${type}!`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
            <Gift className="w-3.5 h-3.5" />
            <span>Kalkulator & Manifest H-1 Idul Fitri</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kalkulasi Pembagian Batch Dana & Barang</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formula PRD: Dana Bersih = Total Tabungan - Biaya Admin - Paket Barang - Penarikan Darurat.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('EXCEL')}
            className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {downloadToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="text-xs text-slate-400">Total Uang Tunai Bersih Dibagikan:</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            Rp {totalDisbursedCash.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Untuk 5 nasabah batch demo</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="text-xs text-slate-400">Total Paket Barang Disiapkan:</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">4 Paket</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sembako, Kue Kaleng, Perabotan</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="text-xs text-slate-400">Jadwal Pencairan Terjadwal:</div>
          <div className="text-lg font-bold text-white mt-1">H-1 Idul Fitri 1447H</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">12 Maret 2027 (08:00 WIB)</div>
        </div>
      </div>

      {/* Batch Calculation Manifest Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-x-auto">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Manifest Rincian Pembagian Seluruh Nasabah</h3>
          <span className="text-xs text-amber-400 font-semibold font-mono">Status: Ready for Disbursement</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
            <tr>
              <th className="py-3.5 px-4">Nama Nasabah</th>
              <th className="py-3.5 px-4">Total Tabungan</th>
              <th className="py-3.5 px-4">Biaya Admin</th>
              <th className="py-3.5 px-4">Paket Pilihan</th>
              <th className="py-3.5 px-4">Tarik Darurat</th>
              <th className="py-3.5 px-4 text-right">Uang Bersih (Payout)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {payoutRows.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 font-sans font-bold text-white">
                  <div>{r.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{r.phone}</div>
                </td>
                <td className="py-4 px-4 text-slate-300">Rp {r.totalSaved.toLocaleString('id-ID')}</td>
                <td className="py-4 px-4 text-slate-400">- Rp {r.adminFee.toLocaleString('id-ID')}</td>
                <td className="py-4 px-4 font-sans">
                  <div className="text-amber-300 text-[11px] font-semibold">{r.bundleName}</div>
                  {r.bundlePrice > 0 && (
                    <div className="text-[10px] text-slate-400 font-mono">- Rp {r.bundlePrice.toLocaleString('id-ID')}</div>
                  )}
                </td>
                <td className="py-4 px-4 text-rose-400">
                  {r.emergencyWithdrawn > 0 ? `- Rp ${r.emergencyWithdrawn.toLocaleString('id-ID')}` : 'Rp 0'}
                </td>
                <td className="py-4 px-4 text-right font-black text-emerald-400 text-sm">
                  Rp {r.payout.netPayoutAmount.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
