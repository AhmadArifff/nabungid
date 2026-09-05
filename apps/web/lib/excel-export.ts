import * as XLSX from 'xlsx';
import { AttendanceMatrixMember } from '../stores/useAdminStore';
import { formatWeekDueDate } from './date-format';

/**
 * Export 50-week Savings Ledger (Buku Tabungan) to Native Excel (.xlsx) file.
 */
export function exportAttendanceMatrixToExcel(
  members: AttendanceMatrixMember[],
  fileName = 'Buku_Tabungan_NabungID_1447H.xlsx'
) {
  // Build spreadsheet rows
  const rows = members.map((m, index) => {
    const row: Record<string, any> = {
      No: index + 1,
      'Nama Nasabah': m.name,
      'Nomor WhatsApp': m.phone,
      'Nominal Mingguan': m.weeklyNominal,
      'Paket Barang': m.bundleName,
      'Total Kas Terhimpun (Rp)': m.totalSaved,
      'Total Minggu Lunas': m.verifiedCount,
      'Menunggu Verifikasi': m.waitingCount,
      'Belum Bayar': m.unpaidCount,
      'Streak Disiplin': m.streakCount,
    };

    // Add 50 week columns with due dates
    m.ledgers.forEach((l) => {
      let statusStr = 'Belum Bayar';
      if (l.status === 'VERIFIED') {
        statusStr = l.paymentMethod === 'CASH' ? 'LUNAS (TUNAI)' : 'LUNAS (TRANSFER)';
      } else if (l.status === 'WAITING_VERIFICATION') {
        statusStr = 'MENUNGGU VERIFIKASI';
      }
      const colHeader = `M${l.weekNumber} (${formatWeekDueDate(l.weekNumber, l.dueDate)})`;
      row[colHeader] = statusStr;
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Tabungan 50 Minggu');

  // Trigger browser download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export H-1 Eid al-Fitr Distribution Manifest to Native Excel (.xlsx) file.
 */
export function exportDistributionManifestToExcel(
  disbursements: Array<{
    userName: string;
    userPhone: string;
    programName: string;
    bundleName: string;
    totalSavedAmount: number;
    adminFeeAmount: number;
    packageGoodsAmount: number;
    emergencyDeductionAmount: number;
    netPayoutAmount: number;
    status: string;
  }>,
  fileName = 'Manifest_Distribusi_H1_IdulFitri_1447H.xlsx'
) {
  const rows = disbursements.map((d, index) => ({
    No: index + 1,
    'Nama Nasabah': d.userName,
    'Nomor WhatsApp': d.userPhone,
    'Program Tabungan': d.programName,
    'Paket Barang / Sembako': d.bundleName,
    'Total Tabungan Terkumpul (Rp)': d.totalSavedAmount,
    'Potongan Biaya Admin (Rp)': d.adminFeeAmount,
    'Potongan Paket Barang (Rp)': d.packageGoodsAmount,
    'Potongan Penarikan Darurat (Rp)': d.emergencyDeductionAmount,
    'DANA BERSIH DITERIMA (Rp)': d.netPayoutAmount,
    'Status Pembagian': d.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Manifest Distribusi H-1');

  // Trigger browser download
  XLSX.writeFile(workbook, fileName);
}
