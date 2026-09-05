'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  MessageCircle,
  Phone,
  Search,
  Check,
  Zap,
  RotateCcw,
  Printer,
  Download,
  AlertTriangle,
  X,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { useAdminStore, AttendanceMatrixMember } from '../../stores/useAdminStore';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';
import { DigitalReceiptModal } from '../nasabah/DigitalReceiptModal';
import { exportAttendanceMatrixToExcel } from '../../lib/excel-export';
import { useAutoSync } from '../../hooks/useAutoSync';
import { formatWeekDueDate } from '../../lib/date-format';

interface AdminAttendanceMatrixProps {
  onOpenQuickVerification?: (member: AttendanceMatrixMember, weekNumber: number) => void;
}

export const AdminAttendanceMatrix: React.FC<AdminAttendanceMatrixProps> = () => {
  const { attendanceMembers, isLoadingMatrix, fetchAttendanceMatrix, quickCashCheckin, revertCheckin } =
    useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'WAITING' | 'OVERDUE'>('ALL');
  const [selectedReminder, setSelectedReminder] = useState<{ member: AttendanceMatrixMember; weekNumber: number } | null>(null);
  const [selectedCellAction, setSelectedCellAction] = useState<{
    member: AttendanceMatrixMember;
    weekNumber: number;
    status: 'VERIFIED' | 'WAITING_VERIFICATION' | 'PENDING_PAYMENT' | 'REJECTED';
    amount: number;
    paymentMethod?: string;
    paidDate?: string;
  } | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<{
    member: AttendanceMatrixMember;
    weekNumber: number;
    amount: number;
    paidDate?: string;
    paymentMethod?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch live database matrix on mount
  useEffect(() => {
    fetchAttendanceMatrix();
  }, [fetchAttendanceMatrix]);

  // Real-time background sync every 1 minute
  useAutoSync(fetchAttendanceMatrix, 60000);

  const handleExportExcel = () => {
    exportAttendanceMatrixToExcel(attendanceMembers);
    setToastMessage('Berkas Excel Buku Tabungan (.xlsx) berhasil diunduh!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtering
  const filteredMembers = attendanceMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (statusFilter === 'VERIFIED') return m.unpaidCount === 0;
    if (statusFilter === 'WAITING') return m.waitingCount > 0;
    if (statusFilter === 'OVERDUE') return m.unpaidCount > 0;
    return true;
  });

  const handleQuickCash = async (member: AttendanceMatrixMember, weekNumber: number) => {
    const res = await quickCashCheckin(member.id, weekNumber);
    setToastMessage(res.message);
    setSelectedCellAction(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRevertCheckin = async (member: AttendanceMatrixMember, weekNumber: number) => {
    const res = await revertCheckin(member.id, weekNumber);
    setToastMessage(res.message);
    setSelectedCellAction(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenReminder = (member: AttendanceMatrixMember, weekNumber: number) => {
    setSelectedReminder({ member, weekNumber });
    setSelectedCellAction(null);
  };

  const totalKasMatrix = attendanceMembers.reduce((sum, m) => sum + m.totalSaved, 0);
  const totalLunasCap = attendanceMembers.reduce((sum, m) => sum + m.verifiedCount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-400/70 hover:text-emerald-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Kas Terhimpun:</div>
            <div className="text-xl font-black font-mono text-emerald-400">
              Rp {(totalKasMatrix ?? 0).toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400">{attendanceMembers.length} Nasabah Aktif di Database</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Cap Stempel Lunas:</div>
            <div className="text-xl font-black font-mono text-white">
              {totalLunasCap} <span className="text-xs font-normal text-slate-400 font-sans">Setoran</span>
            </div>
            <div className="text-[10px] text-emerald-400">Tersinkronisasi ke Supabase</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Fitur Setor & Batal Dinamis:</div>
            <div className="text-sm font-bold text-white">1-Click Check & Uncheck</div>
            <div className="text-[10px] text-slate-400">Klik kotak untuk ubah status kapan saja</div>
          </div>
        </div>
      </div>

      {/* Control Bar (Search, Filter, Actions, Refresh) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama nasabah atau nomor WhatsApp..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: `Semua (${attendanceMembers.length})` },
            { key: 'WAITING', label: `⏳ Ada Antrean` },
            { key: 'OVERDUE', label: `🔴 Belum Bayar` },
            { key: 'VERIFIED', label: `🟢 Disiplin Lunas` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === tab.key
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Sync 1 Menit</span>
          </div>
          <button
            onClick={() => fetchAttendanceMatrix()}
            disabled={isLoadingMatrix}
            title="Refresh Data dari Database Supabase (Auto-sync tiap 1 menit)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMatrix ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleExportExcel}
            className="py-1.5 px-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-1.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar</span>
          </button>
        </div>
      </div>

      {/* 📊 50-Week Matrix Spreadsheet Table with Sticky Column */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10 sticky top-0 z-20">
              <tr>
                {/* Sticky Left Column 1: Member Name */}
                <th className="py-3.5 px-4 sticky left-0 z-30 bg-slate-950 shadow-md min-w-[200px]">
                  Nama Nasabah
                </th>
                {/* Sticky Left Column 2: Program & Stats */}
                <th className="py-3.5 px-4 sticky left-[200px] z-30 bg-slate-950 shadow-md min-w-[130px] border-r border-white/10 text-right">
                  Total Kas
                </th>
                {/* 50 Weekly Columns */}
                {Array.from({ length: 50 }, (_, i) => {
                  const weekNum = i + 1;
                  const sampleDueDate = attendanceMembers[0]?.ledgers?.find((l) => l.weekNumber === weekNum)?.dueDate;
                  const dateLabel = formatWeekDueDate(weekNum, sampleDueDate);
                  return (
                    <th key={weekNum} className="py-2.5 px-2 text-center min-w-[80px] font-mono text-[10px] whitespace-nowrap border-l border-white/5">
                      <div className="text-white font-bold">M{weekNum}</div>
                      <div className="text-[9px] text-slate-400 font-sans font-normal lowercase">({dateLabel})</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Sticky Column: Member Name */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-900/90 shadow-md font-sans">
                    <div className="font-bold text-white text-xs">{member.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{member.phone}</span>
                    </div>
                  </td>

                  {/* Sticky Column: Total Saved */}
                  <td className="py-3 px-4 sticky left-[200px] z-10 bg-slate-900 group-hover:bg-slate-900/90 shadow-md border-r border-white/10 text-right">
                    <div className="font-black text-amber-300 text-xs">
                      Rp {(member.totalSaved / 1000).toFixed(0)}k
                    </div>
                    <div className="text-[10px] text-emerald-400 font-sans">
                      {member.verifiedCount}/50 Lunas
                    </div>
                  </td>

                  {/* 50 Weekly Check-in Cells */}
                  {member.ledgers.map((ledger) => {
                    const isVerified = ledger.status === 'VERIFIED';
                    const isWaiting = ledger.status === 'WAITING_VERIFICATION';
                    const isUnpaid = ledger.status === 'PENDING_PAYMENT' || ledger.status === 'REJECTED';

                    return (
                      <td key={ledger.weekNumber} className="py-2 px-1 text-center border-l border-white/5">
                        {isVerified && (
                          <button
                            onClick={() =>
                              setSelectedCellAction({
                                member,
                                weekNumber: ledger.weekNumber,
                                status: 'VERIFIED',
                                amount: ledger.amount,
                                paymentMethod: ledger.paymentMethod,
                                paidDate: ledger.paidDate,
                              })
                            }
                            title={`Minggu ${ledger.weekNumber}: Lunas (${ledger.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'}). Klik untuk opsi / uncheck.`}
                            className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-sm transition-all hover:scale-105 cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        )}

                        {isWaiting && (
                          <button
                            onClick={() =>
                              setSelectedCellAction({
                                member,
                                weekNumber: ledger.weekNumber,
                                status: 'WAITING_VERIFICATION',
                                amount: ledger.amount,
                                paymentMethod: ledger.paymentMethod,
                                paidDate: ledger.paidDate,
                              })
                            }
                            title={`Minggu ${ledger.weekNumber}: Menunggu Verifikasi. Klik untuk review / setujui.`}
                            className="w-8 h-8 rounded-lg bg-amber-400/20 hover:bg-amber-400/35 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto animate-pulse transition-all hover:scale-105 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isUnpaid && (
                          <div className="relative group/cell mx-auto w-8 h-8">
                            <button
                              onClick={() =>
                                setSelectedCellAction({
                                  member,
                                  weekNumber: ledger.weekNumber,
                                  status: 'PENDING_PAYMENT',
                                  amount: ledger.amount,
                                })
                              }
                              className="w-8 h-8 rounded-lg bg-slate-950/40 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/50 text-slate-500 hover:text-emerald-400 flex items-center justify-center mx-auto text-[10px] transition-all cursor-pointer"
                            >
                              {ledger.weekNumber}
                            </button>
                            {/* Hover Quick Action Popover */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity z-40 flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-amber-400/50 shadow-2xl whitespace-nowrap pointer-events-none group-hover/cell:pointer-events-auto">
                              <button
                                onClick={() => handleQuickCash(member, ledger.weekNumber)}
                                title="Setor Tunai Instan (Quick Cash ke Database)"
                                className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                              >
                                <Zap className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenReminder(member, ledger.weekNumber)}
                                title="Kirim Pengingat WhatsApp"
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🛠️ Cell Action & Uncheck / Revert Dialog */}
      {selectedCellAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCellAction(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-4 border-b border-white/10">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2 ${
                  selectedCellAction.status === 'VERIFIED'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : selectedCellAction.status === 'WAITING_VERIFICATION'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {selectedCellAction.status === 'VERIFIED' ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : selectedCellAction.status === 'WAITING_VERIFICATION' ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <Zap className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-base font-bold text-white">
                Kelola Setoran Mg-{selectedCellAction.weekNumber} ({formatWeekDueDate(selectedCellAction.weekNumber)})
              </h3>
              <p className="text-xs text-amber-400 font-medium mt-0.5">{selectedCellAction.member.name}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Status Saat Ini:</span>
                <span
                  className={`font-bold ${
                    selectedCellAction.status === 'VERIFIED'
                      ? 'text-emerald-400'
                      : selectedCellAction.status === 'WAITING_VERIFICATION'
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }`}
                >
                  {selectedCellAction.status === 'VERIFIED'
                    ? 'LUNAS (VERIFIED)'
                    : selectedCellAction.status === 'WAITING_VERIFICATION'
                    ? 'MENUNGGU VERIFIKASI'
                    : 'BELUM BAYAR'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Jatuh Tempo Target:</span>
                <span className="font-mono text-slate-300">
                  {(() => {
                    const start = new Date('2026-04-05');
                    start.setDate(start.getDate() + (selectedCellAction.weekNumber - 1) * 7);
                    return start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  })()}
                </span>
              </div>
              {selectedCellAction.paidDate && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Tanggal Diterima Kas:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {new Date(selectedCellAction.paidDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Nominal Setoran:</span>
                <span className="font-mono font-bold text-white">
                  Rp {(selectedCellAction?.amount ?? 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="space-y-2 pt-3">
              {selectedCellAction.status === 'PENDING_PAYMENT' && (
                <>
                  <button
                    onClick={() => handleQuickCash(selectedCellAction.member, selectedCellAction.weekNumber)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Centang Lunas (Setor Tunai Instan)</span>
                  </button>
                  <button
                    onClick={() => handleOpenReminder(selectedCellAction.member, selectedCellAction.weekNumber)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Kirim Pengingat WhatsApp</span>
                  </button>
                </>
              )}

              {selectedCellAction.status === 'VERIFIED' && (
                <>
                  <button
                    onClick={() => {
                      setReceiptModalData({
                        member: selectedCellAction.member,
                        weekNumber: selectedCellAction.weekNumber,
                        amount: selectedCellAction.amount,
                        paidDate: selectedCellAction.paidDate,
                        paymentMethod: selectedCellAction.paymentMethod,
                      });
                      setSelectedCellAction(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Lihat & Cetak Kwitansi Sah</span>
                  </button>
                  <button
                    onClick={() => handleRevertCheckin(selectedCellAction.member, selectedCellAction.weekNumber)}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Batalkan / Uncheck Setoran (Kembalikan ke Belum Bayar)</span>
                  </button>
                </>
              )}

              {selectedCellAction.status === 'WAITING_VERIFICATION' && (
                <>
                  <button
                    onClick={() => handleQuickCash(selectedCellAction.member, selectedCellAction.weekNumber)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui Pembayaran Ini</span>
                  </button>
                  <button
                    onClick={() => handleRevertCheckin(selectedCellAction.member, selectedCellAction.weekNumber)}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak & Kembalikan ke Belum Bayar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={Boolean(selectedReminder)}
        member={selectedReminder?.member ?? null}
        weekNumber={selectedReminder?.weekNumber ?? 1}
        onClose={() => setSelectedReminder(null)}
      />

      {/* Digital Receipt Modal for Admin View */}
      {receiptModalData && (
        <DigitalReceiptModal
          isOpen={Boolean(receiptModalData)}
          ledger={{
            id: `ldg-${receiptModalData.weekNumber}`,
            memberSavingId: receiptModalData.member.id,
            weekNumber: receiptModalData.weekNumber,
            dueDate: new Date().toISOString(),
            paidDate: receiptModalData.paidDate || new Date().toISOString(),
            amount: receiptModalData.amount,
            status: 'VERIFIED',
            paymentMethod: (receiptModalData.paymentMethod as any) || 'CASH',
          }}
          userName={receiptModalData.member.name}
          userPhone={receiptModalData.member.phone}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
};
