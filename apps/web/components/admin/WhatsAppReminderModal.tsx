'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { AttendanceMatrixMember } from '../../stores/useAdminStore';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  member: AttendanceMatrixMember | null;
  weekNumber: number;
  onClose: () => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  member,
  weekNumber,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  const formattedPhone = member.phone.startsWith('0')
    ? '62' + member.phone.slice(1)
    : member.phone.replace(/[^0-9]/g, '');

  const defaultMessage = `Assalamu'alaikum Ibu/Bapak ${member.name}, pengingat setoran tabungan Idul Fitri 1447H untuk *Minggu ke-${weekNumber} (Rp ${(member.weeklyNominal ?? 0).toLocaleString('id-ID')})* telah dibuka. Yuk cek-in kartu tabungan Anda di: https://nabungid.com/tabunganku. Terima kasih & semoga berkah! ✨`;

  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedPhone}?text=${encoded}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pusat Pengingat WhatsApp Resmi</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Kirim Pengingat Setoran Mingguan</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kirimkan notifikasi tagihan ramah ke WhatsApp nasabah untuk Minggu ke-{weekNumber}.
          </p>
        </div>

        {/* Member Profile Snapshot */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-bold text-white">{member.name}</div>
            <div className="text-xs text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{member.phone}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">Nominal Setoran:</div>
            <div className="text-sm font-bold font-mono text-amber-300">
              Rp {(member.weeklyNominal ?? 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-2 mb-5">
          <label className="block text-xs font-medium text-slate-300">Pratinjau Pesan WhatsApp:</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <span>Salin Teks</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Buka & Kirim WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
