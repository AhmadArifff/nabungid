'use client';

import React, { useEffect, useState } from 'react';
import { Gift, Download, Printer, RefreshCw } from 'lucide-react';
import { useToastStore } from '../../../../stores/useToastStore';
import { useAdminStore } from '../../../../stores/useAdminStore';
import { exportDistributionManifestToExcel } from '../../../../lib/excel-export';

export default function AdminDistribusiPage() {
  const { success } = useToastStore();
  const { distributionBatch, fetchDistributionBatch } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDistributionBatch().finally(() => setIsLoading(false));
  }, [fetchDistributionBatch]);

  const payoutRows = distributionBatch.map((m) => ({
    id: m.memberSavingId,
    name: m.userName,
    phone: m.userPhone,
    totalSaved: m.totalSavedAmount,
    adminFee: m.adminFeeAmount,
    bundleName: m.bundleName || 'Tanpa Paket',
    bundlePrice: m.packageGoodsAmount,
    emergencyWithdrawn: m.emergencyDeductionAmount,
    netPayoutAmount: m.netPayoutAmount,
  }));

  const totalDisbursedCash = payoutRows.reduce((sum, r) => sum + r.netPayoutAmount, 0);

  const handleExportExcel = () => {
    const manifestData = payoutRows.map((r) => ({
      userName: r.name,
      userPhone: r.phone,
      programName: 'Paket Berkah 100k (50 Minggu)',
      bundleName: r.bundleName,
      totalSavedAmount: r.totalSaved,
      adminFeeAmount: r.adminFee,
      packageGoodsAmount: r.bundlePrice,
      emergencyDeductionAmount: r.emergencyWithdrawn,
      netPayoutAmount: r.netPayoutAmount,
      status: 'SIAP DICAIRKAN',
    }));

    exportDistributionManifestToExcel(manifestData);
    success('Berkas Manifest Distribusi H-1 (.xlsx) berhasil diunduh!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
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
              onClick={handleExportExcel}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Manifest Excel (.xlsx)</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF Manifest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
          <div className="text-xs text-slate-400">Total Uang Tunai Bersih Dibagikan:</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            Rp {(totalDisbursedCash ?? 0).toLocaleString('id-ID')}
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
              <th className="hidden print:table-cell py-3.5 px-4 text-center">Tanda Tangan Penerima</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {payoutRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-slate-500 font-sans">
                  Belum ada data nasabah aktif yang siap untuk kalkulasi distribusi.
                </td>
              </tr>
            ) : (
              payoutRows.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-sans font-bold text-white">
                    <div>{r.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">Rp {(r.totalSaved ?? 0).toLocaleString('id-ID')}</td>
                  <td className="py-4 px-4 text-slate-400">- Rp {(r.adminFee ?? 0).toLocaleString('id-ID')}</td>
                  <td className="py-4 px-4 font-sans">
                    <div className="text-amber-300 text-[11px] font-semibold">{r.bundleName}</div>
                    {(r.bundlePrice ?? 0) > 0 && (
                      <div className="text-[10px] text-slate-400 font-mono">- Rp {(r.bundlePrice ?? 0).toLocaleString('id-ID')}</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-rose-400">
                    {(r.emergencyWithdrawn ?? 0) > 0 ? `- Rp ${(r.emergencyWithdrawn ?? 0).toLocaleString('id-ID')}` : 'Rp 0'}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-emerald-400 text-sm">
                    Rp {(r.netPayoutAmount ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="hidden print:table-cell py-4 px-4 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400 w-28 mx-auto" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🖨️ Print-Only Official Footer & Authorization Block */}
      <div className="hidden print:block pt-8 mt-8 border-t border-slate-400 break-inside-avoid">
        <div className="flex justify-between items-center text-xs text-slate-800">
          <div>
            <div className="font-bold">Keterangan Verifikasi Manifest:</div>
            <p className="text-[10px] text-slate-600">
              Dokumen ini merupakan Berita Acara resmi pencairan dana & penyerahan paket barang tabungan Idul Fitri 1447H.
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-600 font-mono">
            Total Kas Dibagikan: Rp {(totalDisbursedCash ?? 0).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-10 text-center text-xs">
          <div className="space-y-16">
            <div className="text-slate-700 font-semibold">Ketua Panitia / Pengelola Tabungan,</div>
            <div className="border-b border-slate-900 mx-12 font-bold text-slate-900">
              ( Koordinator Utama )
            </div>
          </div>

          <div className="space-y-16">
            <div className="text-slate-700 font-semibold">Bendahara Kas NabungID,</div>
            <div className="border-b border-slate-900 mx-12 font-bold text-slate-900">
              ( Bendahara Pengelola )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
