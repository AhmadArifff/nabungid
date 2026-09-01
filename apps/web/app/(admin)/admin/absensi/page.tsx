import React from 'react';
import { Metadata } from 'next';
import { Calendar, Download, Printer } from 'lucide-react';
import { AdminAttendanceMatrix } from '../../../../components/admin/AdminAttendanceMatrix';

export const metadata: Metadata = {
  title: 'Matriks Rekap Absensi 50 Minggu | NabungID Admin Console',
  description: 'Lembar matriks absensi dan setoran mingguan 50 minggu seluruh nasabah.',
};

export default function AdminAbsensiPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Attendance Matrix Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Matriks Rekap Absensi 50 Minggu</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau kehadiran setoran seluruh nasabah, entri setoran tunai instan, dan broadcast pengingat WhatsApp.
          </p>
        </div>
      </div>

      {/* Matrix Sheet Component */}
      <AdminAttendanceMatrix />
    </div>
  );
}
