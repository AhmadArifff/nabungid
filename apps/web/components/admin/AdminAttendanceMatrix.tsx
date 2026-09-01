'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  MessageCircle,
  Phone,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Printer,
  Download,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useAdminStore, AttendanceMatrixMember } from '../../stores/useAdminStore';
import { WhatsAppReminderModal } from './WhatsAppReminderModal';

interface AdminAttendanceMatrixProps {
  onOpenQuickVerification?: (member: AttendanceMatrixMember, weekNumber: number) => void;
}

export const AdminAttendanceMatrix: React.FC<AdminAttendanceMatrixProps> = () => {
  const { attendanceMembers, quickCashCheckin } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'WAITING' | 'OVERDUE'>('ALL');
  const [selectedReminder, setSelectedReminder] = useState<{ member: AttendanceMatrixMember; weekNumber: number } | null>(null);
  const [toastMessage, setToastMessage] = useState('');

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

  const handleQuickCash = (member: AttendanceMatrixMember, weekNumber: number) => {
    const res = quickCashCheckin(member.id, weekNumber);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenReminder = (member: AttendanceMatrixMember, weekNumber: number) => {
    setSelectedReminder({ member, weekNumber });
  };

  const totalKasMatrix = attendanceMembers.reduce((sum, m) => sum + m.totalSaved, 0);
  const totalLunasCap = attendanceMembers.reduce((sum, m) => sum + m.verifiedCount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
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
              Rp {totalKasMatrix.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400">{attendanceMembers.length} Nasabah Aktif</div>
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
            <div className="text-[10px] text-emerald-400">Tercatat di sistem</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Fitur Setor Cepat:</div>
            <div className="text-sm font-bold text-white">1-Click Quick Cash Entry</div>
            <div className="text-[10px] text-slate-400">Klik kotak untuk centang tunai</div>
          </div>
        </div>
      </div>

      {/* Control Bar (Search, Filter, Actions) */}
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
                {Array.from({ length: 50 }, (_, i) => (
                  <th key={i + 1} className="py-3 px-2 text-center min-w-[44px] font-mono text-[10px]">
                    M{i + 1}
                  </th>
                ))}
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
                          <div
                            title={`Minggu ${ledger.weekNumber}: Lunas (${ledger.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'})`}
                            className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-sm"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}

                        {isWaiting && (
                          <div
                            title={`Minggu ${ledger.weekNumber}: Menunggu Verifikasi Bukti Transfer`}
                            className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto animate-pulse"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {isUnpaid && (
                          <div className="relative group/cell mx-auto w-8 h-8">
                            <div className="w-8 h-8 rounded-lg bg-slate-950/40 border border-white/10 text-slate-600 flex items-center justify-center mx-auto text-[10px]">
                              {ledger.weekNumber}
                            </div>
                            {/* Hover Quick Action Dropdown Popover */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity z-40 flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-amber-400/50 shadow-2xl whitespace-nowrap">
                              <button
                                onClick={() => handleQuickCash(member, ledger.weekNumber)}
                                title="Setor Tunai Instan (Quick Cash)"
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

      {/* Legend & Instructions */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 font-semibold">Keterangan:</span>
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Lunas (Verified)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-300">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Menunggu Verifikasi</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-500">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span>Belum Cek-in</span>
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          💡 <em>Arahkan mouse ke kotak belum lunas untuk aksi **Setor Tunai Cepat** (<Zap className="w-3 h-3 inline text-emerald-400" />) atau **Kirim WA** (<MessageCircle className="w-3 h-3 inline text-emerald-400" />).</em>
        </div>
      </div>

      {/* WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={Boolean(selectedReminder)}
        member={selectedReminder?.member ?? null}
        weekNumber={selectedReminder?.weekNumber ?? 1}
        onClose={() => setSelectedReminder(null)}
      />
    </div>
  );
};
