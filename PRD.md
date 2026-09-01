# PRD: NabungID — Platform Monorepo Tabungan Idul Fitri & Paket Hari Raya Terintegrasi

**Product:** NabungID (Aplikasi Tabungan Hari Raya & Paket Lebaran Berkelanjutan)  
**Author:** Lead Product Manager & Architecture Squad (`/pm`, `/frontend`, `/backend`, `/qa`)  
**Date:** 2026-09-01  
**Version:** v1.2.0 (Master Comprehensive Edition)  
**Status:** Approved & Ready for Next Development Cycle  
**Architecture:** Turborepo Monorepo (`apps/web`, `apps/api`, `packages/shared`)  

---

## 1. Executive Summary

**NabungID** adalah platform tabungan komunitas modern berbasis Progressive Web App (PWA) dan API terpusat yang dirancang khusus untuk memfasilitasi program tabungan berkala (mingguan) menuju Hari Raya Idul Fitri selama 1 tahun penuh. Program tabungan dimulai secara otomatis pada **H+1 minggu setelah Idul Fitri** dan dicairkan pada **H-1 minggu sebelum Idul Fitri tahun berikutnya** (~48 hingga 50 minggu siklus fleksibel).

Platform ini mengintegrasikan:
1. **Fleksibilitas Paket Tabungan:** Pilihan nominal setoran mingguan dinamis (standar Rp 100.000/minggu, variasi Rp 25.000, Rp 50.000, Rp 200.000, atau custom nominal via Admin Panel).
2. **Katalog Paket Barang/Hampers Dinamis:** Integrasi paket sembako/bahan mentah (daging sapi/ayam, minyak goreng, telur, beras), snack/kue kaleng Lebaran, dan perabotan rumah tangga yang harganya diakumulasikan dan dikurangkan otomatis dari total tabungan akhir.
3. **Formula Distribusi Transparan:**  
   $$\text{Dana Bersih Diterima} = \text{Total Tabungan Terkumpul} - \text{Biaya Admin (Dinamis)} - \text{Total Harga Paket Barang} - \text{Total Penarikan Darurat}$$
4. **Fitur Penarikan Darurat Terkontrol (Emergency Withdrawal):** Nasabah dapat menarik dana tabungan darurat sebelum waktu pembagian tanpa potongan komisi/penalti, dengan aturan tegas: **Maksimal Rp 500.000 dan hanya dapat dilakukan 1x** per siklus tabungan.
5. **Kartu Cek-in & Stempel Absensi Digital Nasabah (Weekly Check-in Stamp Pass):** Tampilan kartu iuran stempel fisik modern dengan tracking *disiplin streak*, tombol cek-in instan, dan fitur cetak/unduh kartu absensi.
6. **Matriks Rekap Absensi 50 Minggu Admin (Admin Attendance Matrix Sheet):** Lembar spreadsheet terpadu di Admin Console yang memetakan kehadiran setoran seluruh nasabah x 50 minggu secara *real-time* dengan fitur *1-Click Cash Setoran Entry*.
7. **Pusat Pengingat WhatsApp & Kwitansi Digital:** Notifikasi tagihan ramah dan kwitansi berstempel digital resmi untuk setiap setoran terverifikasi.
8. **High-Conversion Landing Page & Dual Role Management:** Antarmuka publik 3D (*Three.js Carousel 360°*, Celengan Ayam Emas, Dompet Berkah, Keranjang Sembako), Role Nasabah PWA intuitif, serta Admin Panel komprehensif berprinsip *Zero Hardcoded Master Data*.

---

## 2. Problem Statement & Business Opportunity

### 2.1 Latar Belakang (Background)
Tradisi menabung untuk keperluan Hari Raya Idul Fitri (uang saku hari raya, hampers sembako, kue kaleng, dan perlengkapan rumah tangga) sangat masif di masyarakat Indonesia. Namun, sebagian besar program tabungan RT/RW, arisan, atau kelompok pengajian masih dikelola secara manual menggunakan buku kas fisik, kartu iuran kertas, atau spreadsheet rawan manipulasi.

### 2.2 Permasalahan Utama (Core Problems)
> **Problem:** Pengelolaan tabungan Lebaran manual menimbulkan ketidakpastian saldo, risiko salah hitung biaya admin dan paket barang, sulitnya pencatatan penarikan darurat, hilangnya kartu iuran kertas, serta tidak adanya transparansi pencairan dana di H-1 minggu menjelang Idul Fitri.
> 
> **Target Pengguna Terdampak:** Nasabah/Anggota penabung keluarga/komunitas dan Pengelola Tabungan (Admin/Koordinator).
> 
> **Dampak Negatif:** Sering terjadi selisih kas, komplain nasabah saat pembagian parcel/uang tunai, dan ketidakmampuan nasabah memantau sisa target tabungan mereka secara *real-time*.

### 2.3 Evidence & Matrix Kebutuhan

| Masalah Riil | Kebutuhan Solusi di NabungID | Dampak Solusi |
| :--- | :--- | :--- |
| Buku iuran hilang / rusak | Buku tabungan digital & **Kartu Stempel Absensi 50 Minggu PWA** | Kepercayaan nasabah meningkat 100%, data aman di Cloud PostgreSQL |
| Paket sembako kaku & tidak fleksibel | Sistem Katalog Master Data Barang & Bundling Paket fleksibel di Admin | Nasabah bisa memilih barang/sembako sesuai selera & budget |
| Kebutuhan mendadak di tengah tahun | Penarikan Darurat max Rp 500.000 (1x penarikan, 0% potongan denda) | Likuiditas darurat bagi nasabah tanpa merusak sistem tabungan |
| Admin sulit memantau 50+ nasabah | **Matriks Absensi 50 Minggu (Admin Spreadsheet View)** + Setor Tunai Instan | Rekapitulasi absensi setoran mingguan terpantau dalam 1 layar cepat |
| Nasabah lupa menyetor tiap minggu | **WhatsApp Reminder Center** + Broadcast Notifikasi | Menurunkan rasio tunggakan hingga 85% sebelum H-1 Idul Fitri |
| Perhitungan akhir rumit | Otomatisasi kalkulasi `Tabungan - Admin - Paket - Tarik Darurat` | Rekap pembagian selesai dalam 1 klik tanpa salah hitung |

---

## 3. Target User Personas & Role Matrix

### 3.1 Role 1: Nasabah / Pelanggan (Customer Persona)
- **Profil:** Ibu Rumah Tangga, Pekerja, atau Anggota Komunitas berusia 20–55 tahun.
- **Karakteristik Perangkat:** Mayoritas menggunakan Smartphone (Android/iOS) dengan koneksi mobile data.
- **Tujuan Utama:**
  - Menabung secara konsisten tiap minggu (misal Rp 100.000/minggu) tanpa terasa berat.
  - Memiliki **Kartu Absensi Cek-in Digital** dengan stempel lunas dan tracking streak keaktifan.
  - Memilih paket hampers Lebaran (sembako daging/minyak/telur, kue kaleng, perabotan).
  - Memantau akumulasi saldo dan sisa minggu tabungan dengan indikator visual.
  - Mengajukan penarikan darurat ketika ada kebutuhan mendesak (maksimal Rp 500.000, 1x).
  - Menerima rincian uang sisa dan paket sembako di H-1 minggu Idul Fitri.

### 3.2 Role 2: Pengelola / Admin (Admin Persona)
- **Profil:** Koordinator Tabungan, Pengurus Koperasi, atau Pemilik Bisnis Paket Lebaran.
- **Karakteristik Perangkat:** Desktop / Laptop / Tablet untuk operasional harian.
- **Tujuan Utama:**
  - Mengonfigurasi siklus tabungan (Periode H+1 Idul Fitri s.d. H-1 Idul Fitri berikutnya).
  - Memantau **Matriks Absensi 50 Minggu Seluruh Nasabah** dalam satu layar tabel spreadsheet.
  - Mencatat setoran tunai instan (*1-Click Quick Cash Setoran*) atau memverifikasi upload bukti transfer.
  - Mengirim pengingat WhatsApp ke nasabah yang belum cek-in di minggu berjalan.
  - Mengelola master data nominal program, item barang sembako, dan bundling paket secara dinamis.
  - Menyetujui atau menolak permohonan penarikan darurat nasabah.
  - Melakukan *batch calculation disbursement* dan mengekspor manifest pembagian ke Excel/PDF.

### 3.3 Role-Based Access Control (RBAC) Matrix

| Fitur / Modul | Public / Guest | Nasabah (Pelanggan) | Admin (Pengelola) |
| :--- | :---: | :---: | :---: |
| Landing Page & Simulasi Tabungan 3D | ✅ View Only | ✅ View & Simulate | ✅ View & Simulate |
| Registrasi & Login (Better Auth + JWT) | ✅ Akses | ✅ Akses | ✅ Akses |
| Pendaftaran Program Tabungan Baru | ❌ | ✅ Self-Service | ✅ Create on Behalf |
| Monitoring Progres Tabungan & Kartu Absen Stamp | ❌ | ✅ Data Milik Sendiri | ✅ Semua Nasabah |
| Matriks Rekap Absensi 50 Minggu (Spreadsheet View) | ❌ | ❌ | ✅ Full Matrix View |
| Setor Tunai Cepat (Quick Cash Entry) | ❌ | ❌ | ✅ 1-Click Verification |
| Request Penarikan Darurat (Max 500rb, 1x) | ❌ | ✅ Submit Form | ✅ Review & Approve |
| Master Data Program, Siklus & Biaya Admin | ❌ | ❌ | ✅ Full CRUD (Zero Hardcode) |
| Master Data Item Barang & Bundling Paket | ❌ | ❌ | ✅ Full CRUD (Zero Hardcode) |
| WhatsApp Reminder Broadcast Center | ❌ | ❌ | ✅ Broadcast Trigger |
| Eksekusi Pembagian Dana & Export Manifest H-1 | ❌ | ✅ View Rincian Akhir | ✅ Eksekusi & Export Excel/PDF |
| Unduh Kwitansi Digital Resmi Berstempel | ❌ | ✅ Kwitansi Pribadi | ✅ Semua Kwitansi |

---

## 4. Product Scope & Core Feature Breakdown

### 4.1 Siklus Tabungan & Aturan Waktu (Timeline Rules)
1. **Durasi Siklus:** 1 Tahun Hijriah (Kalender Kerja ~48 hingga 50 minggu).
2. **Titik Mulai (Start Date):** **H+1 Minggu setelah Hari Raya Idul Fitri** (Minggu ke-1).
3. **Titik Selesai & Distribusi (Payout Date):** **H-1 Minggu sebelum Hari Raya Idul Fitri tahun berikutnya** (Minggu ke-49/50).
4. **Fleksibilitas Siklus:** Tanggal pasti Idul Fitri dan total minggu dalam siklus dapat dikonfigurasi secara dinamis oleh Admin melalui menu *Cycle Management*.

```
[ Idul Fitri Tahun X ]
       │
       ▼ (+7 Hari / H+1 Minggu)
[ MINGGU 1: Siklus Dimulai ] ───▶ [ Setoran Mingguan Berjalan (W1 - W48/50) ] ───▶ [ H-1 Minggu Idul Fitri X+1 ]
                                              │                                              │
                                              ▼                                              ▼
                             [ Emergency Withdrawal Limit 500k ]              [ DISTRIBUSI & PEMBAGIAN AKHIR ]
                                (Maksimal 1x Penarikan)                          - Total Tabungan
                                                                                 - Biaya Admin
                                                                                 - Paket Barang / Sembako
                                                                                 - Penarikan Darurat
                                                                                 =======================
                                                                                 = DANA BERSIH DITERIMA
```

---

### 4.2 Formula & Kalkulasi Pembagian Akhir (Distribution Payout Logic)

Setiap nasabah yang terdaftar pada satu siklus tabungan akan dihitung pembagian akhirnya dengan formula baku:

$$\text{Dana Bersih Diterima} = \text{Total Tabungan Terkumpul} - \text{Biaya Admin} - \text{Total Nilai Paket Barang} - \text{Total Penarikan Darurat}$$

#### Komponen Formula:
1. **Total Tabungan Terkumpul:** Jumlah seluruh setoran mingguan yang telah diverifikasi (`WeeklyLedger.status = 'VERIFIED'`).
2. **Biaya Admin:** Nilai biaya administrasi yang diatur oleh Admin pada program tabungan terkait (nominal tetap misal Rp 25.000/siklus atau persentase).
3. **Total Nilai Paket Barang:** Akumulasi harga barang yang dipilih nasabah (contoh: Paket Sembako Berkah seharga Rp 318.000 berisi Daging 1kg, Telur 1 tray, Minyak 2L, Beras 5kg).
4. **Total Penarikan Darurat:** Total nominal uang yang ditarik lebih awal oleh nasabah selama periode berjalan (maksimal Rp 500.000).

#### Contoh Kasus Nyata:
- Nasabah menabung paket **Rp 100.000 / minggu** selama **50 minggu**.
  - Total Tabungan: $50 \times \text{Rp } 100.000 = \text{Rp } 5.000.000$
  - Biaya Admin Program: $\text{Rp } 25.000$
  - Paket Barang Terpilih: Paket Sembako seharga $\text{Rp } 318.000$
  - Penarikan Darurat (Bulan ke-6): $\text{Rp } 400.000$ (1x limit)
- **Rincian Pembagian pada H-1 Minggu Idul Fitri:**
  - Hak Barang: 1 Paket Sembako Berkah.
  - Uang Tunai Diterima: $\text{Rp } 5.000.000 - \text{Rp } 25.000 - \text{Rp } 318.000 - \text{Rp } 400.000 = \mathbf{\text{Rp } 4.257.000}$.

---

### 4.3 Aturan Ketat Penarikan Darurat (Emergency Withdrawal Policy)

Untuk menjaga likuiditas kas dan kedisiplinan menabung, sistem menerapkan aturan validasi bisnis (*Business Rules Guard*):

1. **Bebas Komisi / Penalti (0% Fee):** Penarikan tidak dikenakan potongan denda apa pun.
2. **Batas Nominal Maksimal:** Total penarikan darurat **tidak boleh melebihi Rp 500.000**.
3. **Batas Frekuensi Transaksi:** Nasabah hanya dapat menarik dana darurat **maksimal 1 (satu) kali** per program tabungan.
4. **Validasi Saldo Berjalan (*Minimum Safe Balance Guard*):**
   - Formula Validasi: $\text{Saldo Terverifikasi} \ge \text{Nominal Pengajuan} + \text{Biaya Admin}$.
5. **Alur Approval Admin:** Permintaan penarikan berstatus `PENDING_APPROVAL` $\rightarrow$ Admin memeriksa dan menyetujui (`APPROVED`) atau menolak (`REJECTED` dengan alasan) $\rightarrow$ Admin mentransfer dana / menyerahkan tunai dan mengunggah bukti disbursement $\rightarrow$ Status berubah menjadi `COMPLETED`.

---

### 4.4 Sistem Kartu Cek-in & Stempel Absensi 50 Minggu Nasabah (Weekly Check-in Stamp Pass)

Setiap nasabah memiliki kartu absensi setoran digital yang interaktif di halaman `/tabunganku`:

1. **Member Pass Header:** Menampilkan Nama Nasabah, Nomor Anggota/WhatsApp, Program (misal: 100rb/minggu), dan Periode 1447H.
2. **Streak & Attendance Badges:**
   - 🔥 **Disiplin Streak:** Menghitung jumlah minggu berturut-turut lunas tanpa putus.
   - 🟢 **Total Stempel Lunas:** Cap stempel hijau zamrud dengan tulisan `LUNAS ✓`.
   - 🟡 **Menunggu Verifikasi:** Jumlah minggu bukti transfer sedang diproses.
   - 🎯 **Sisa Menuju Lebaran:** Hitungan sisa minggu hingga H-1 Idul Fitri.
3. **50-Slot Check-in Matrix:** Grid 50 kotak stempel dengan aksi cek-in cepat untuk minggu berjalan.
4. **Dual Mode View:** Switcher antara *📇 Mode Kartu Stamp Absensi* dan *📋 Mode Tabel Rekap*.
5. **Cetak Kartu Absensi:** Dukungan print stylesheet `@media print` untuk mencetak lembar kartu iuran ukuran A5/B5.

---

### 4.5 Matriks Rekap Absensi 50 Minggu Admin (Admin Attendance Matrix Sheet)

Admin Console dilengkapi lembar spreadsheet matriks kehadiran di halaman `/admin/absensi`:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           MATRIKS REKAP ABSENSI 50 MINGGU (ADMIN CONSOLE)                       │
├───────────────────┬──────────────┬────────┬────────┬────────┬────────┬────────┬───────┬─────────┤
│ Nama Nasabah      │ No. WhatsApp │ Mg 1   │ Mg 2   │ Mg 3   │ ...    │ Mg 19  │ Mg 50 │ Total   │
├───────────────────┼──────────────┼────────┼────────┼────────┼────────┼────────┼───────┼─────────┤
│ 1. Ahmad Arif     │ 081234567890 │  🟢    │  🟢    │  🟢    │  ...   │   🟡   │  ⚪   │ 18/50   │
│ 2. Siti Rahmawati │ 085711223344 │  🟢    │  🟢    │  🟢    │  ...   │   🟢   │  ⚪   │ 19/50   │
│ 3. Budi Santoso   │ 081987654321 │  🟢    │  🟢    │  🔴    │  ...   │   ⚪   │  ⚪   │ 12/50   │
└───────────────────┴──────────────┴────────┴────────┴────────┴────────┴────────┴───────┴─────────┘
  Keterangan Warna:
  🟢 = Lunas (VERIFIED)    🟡 = Menunggu Verifikasi (WAITING)    🔴 = Menunggak    ⚪ = Belum Masuk Waktu
```

1. **Sticky Left Columns:** Kolom Nama dan Nomor Telepon tetap terkunci di sisi kiri saat tabel di-scroll secara horizontal ke minggu ke-50.
2. **1-Click Quick Cash Setoran:** Admin dapat mengklik sel minggu untuk langsung mencatat setoran tunai (*cash*) tanpa perlu upload foto bukti.
3. **Filter Rekap Absensi:** Opsi filter cepat: *Semua Nasabah*, *Disiplin / Lunas*, *Ada Antrean Verifikasi*, *Memiliki Tunggakan*.
4. **Export Lembar Absensi:** Tombol unduh lembar absensi ke format Excel (`.xlsx`) dan PDF.

---

### 4.6 Pusat Pengingat WhatsApp & Broadcast Center (WhatsApp Notification Center)

Untuk menekan angka tunggakan dan mempermudah komunikasi pengurus:
1. **Tombol Blast Pengingat Mingguan:** Admin dapat memicu template pesan WhatsApp ke nasabah yang belum cek-in pada minggu berjalan.
2. **Template Pesan Dinamis:**
   > *"Assalamu'alaikum Ibu/Bapak [Nama Nasabah], pengingat setoran tabungan Idul Fitri 1447H untuk **Minggu ke-[X] (Rp [Nominal])** telah dibuka. Yuk cek-in kartu tabungan Anda di: https://nabungid.com/tabunganku. Terima kasih & semoga berkah!"*
3. **Integrasi WhatsApp Direct Link (`wa.me`):** Membuka aplikasi WhatsApp Web/Mobile pengurus secara instan dengan teks terisi otomatis.

---

### 4.7 Kwitansi Digital & Export File Riil

1. **Kwitansi Digital Resmi:** Setiap setoran mingguan yang diverifikasi menghasilkan lembar kwitansi digital bertanda tangan elektronik/stempel QR Code yang dapat diunduh nasabah.
2. **Real File Manifest Export:** Menggunakan library `xlsx` untuk menghasilkan dokumen Excel berformat rapi dan `jspdf` untuk dokumen cetak tanda terima H-1 Idul Fitri.

---

### 4.8 Master Data Dinamis & Zero Hardcode Policy

Sesuai standar arsitektur `/pm` & `/backend`, seluruh entitas bisnis dikelola dinamis di database PostgreSQL via Admin Panel tanpa hardcode enum di kode program:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DYNAMIC MASTER DATA ENGINE                      │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. SavingsProgram              │ - Nominal Mingguan (25k, 50k, 100k,…) │
│                                │ - Durasi Minggu Target (50 Minggu)    │
│                                │ - Default Admin Fee Program           │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. ProductCategory             │ - Sembako Mentah (Daging, Telur, dll) │
│                                │ - Makanan & Snack (Kue Kaleng, Sirup) │
│                                │ - Perabotan & Home Living             │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. ProductItem                 │ - Nama Barang, Satuan, Estimasi Harga │
│                                │ - Foto Barang, Status Ketersediaan    │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. PackageBundle               │ - Bundling Items (Isi Paket Barang)   │
│                                │ - Total Harga Paket Akumulasi         │
├────────────────────────────────┼───────────────────────────────────────┤
│ 5. SavingsCycle                │ - Tahun Periode (e.g. 1447H / 2026M)  │
│                                │ - Tanggal Mulai (H+1 Lebaran)         │
│                                │ - Tanggal Pencairan (H-1 Lebaran)     │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 5. System Architecture & Monorepo Structure

Aplikasi dibangun menggunakan arsitektur **Turborepo Monorepo**:

```
nabungid/
├── apps/
│   ├── web/                        # Next.js 14/15 (App Router) + PWA Frontend
│   │   ├── app/
│   │   │   ├── (auth)/             # Login, Register
│   │   │   ├── (public)/           # High-Converting Landing Page 3D
│   │   │   ├── (nasabah)/          # Dashboard, Tabunganku (Stamp Card), Paket, Penarikan, Profil
│   │   │   └── (admin)/            # Dashboard, Absensi (Matrix), Verifikasi, Penarikan, Master Data, Distribusi
│   │   ├── components/             # UI Components (Shadcn, Lucide, Custom Cards)
│   │   ├── hooks/                  # Custom Hooks dengan Result Pattern
│   │   ├── stores/                 # Zustand Global State (useAuthStore, useNasabahStore, useAdminStore)
│   │   ├── styles/                 # Tailwind CSS & Design Tokens
│   │   └── next.config.mjs         # PWA Configuration (next-pwa / serwist)
│   │
│   └── api/                        # Express.js + TypeScript REST Backend
│       ├── src/
│       │   ├── config/             # Database, Supabase Client, Env
│       │   ├── controllers/        # Request Handlers
│       │   ├── services/           # Domain Logic (Payout, Ledger, Emergency, Storage)
│       │   ├── middleware/         # Auth Guard (JWT RBAC), Error Middleware
│       │   ├── routes/             # REST Endpoints (/api/v1/...)
│       │   ├── exceptions/         # Custom Domain Exceptions
│       │   └── utils/              # Result Pattern & Winston Logger
│       ├── prisma/
│       │   ├── schema.prisma       # Prisma Database Models
│       │   └── seed.ts             # Initial Database Seed Script
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                     # Shared Library
│   │   ├── src/
│   │   │   ├── types/              # DTOs, Enums, Entity Interfaces
│   │   │   ├── schemas/            # Zod Validation Schemas
│   │   │   ├── constants/          # App Constants
│   │   │   └── calculations/       # Pure Logic (Payout, Emergency Validation)
│   │   └── package.json
│   ├── tsconfig/                   # Base TypeScript Configs
│   └── eslint-config/              # Shared ESLint Rules
│
├── turbo.json                      # Turborepo Pipeline Configuration
├── package.json                    # Workspace Root Config
└── PRD.md                          # Master Product Requirements Document
```

---

## 6. Detailed Technical Specifications

### 6.1 Database Schema (Prisma ORM for Supabase PostgreSQL)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  NASABAH
}

enum SavingsStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

enum LedgerStatus {
  PENDING_PAYMENT
  WAITING_VERIFICATION
  VERIFIED
  REJECTED
}

enum WithdrawalStatus {
  PENDING_APPROVAL
  APPROVED
  REJECTED
  COMPLETED
}

enum PaymentMethod {
  CASH
  BANK_TRANSFER
  QRIS
}

model User {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  phoneNumber   String         @unique
  passwordHash  String
  role          Role           @default(NASABAH)
  avatarUrl     String?
  address       String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  savings       MemberSaving[]
  withdrawals   EmergencyWithdrawal[]
  auditLogs     AdminAuditLog[]

  @@index([role])
  @@index([phoneNumber])
}

model SavingsCycle {
  id            String          @id @default(uuid())
  name          String          // e.g. "Tabungan Idul Fitri 1447 H / 2026 M"
  hijriYear     String          // "1447 H"
  startDate     DateTime        // H+1 Minggu setelah Idul Fitri
  endDate       DateTime        // H-1 Minggu sebelum Idul Fitri berikutnya
  totalWeeks    Int             @default(50)
  isActive      Boolean         @default(true)
  isClosed      Boolean         @default(false)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  programs      SavingsProgram[]
  savings       MemberSaving[]
}

model SavingsProgram {
  id                 String         @id @default(uuid())
  cycleId            String
  name               String         // e.g. "Paket Berkah 100K Mingguan"
  weeklyNominal      Decimal        @db.Decimal(12, 2) // e.g. 100000.00
  targetWeeks        Int            @default(50)
  adminFee           Decimal        @db.Decimal(12, 2) @default(25000.00)
  description        String?
  isActive           Boolean        @default(true)
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  cycle              SavingsCycle   @relation(fields: [cycleId], references: [id], onDelete: Cascade)
  memberSavings      MemberSaving[]

  @@index([cycleId])
}

model ProductCategory {
  id          String        @id @default(uuid())
  name        String        @unique // Sembako, Kue Kaleng, Perabotan
  slug        String        @unique
  description String?
  icon        String?       // Lucide icon name
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  items       ProductItem[]
}

model ProductItem {
  id            String              @id @default(uuid())
  categoryId    String
  name          String              // e.g. "Daging Sapi Segar 1 Kg"
  unit          String              // "Kg", "Kaleng", "Liter", "Set"
  estimatedPrice Decimal            @db.Decimal(12, 2)
  imageUrl      String?
  description   String?
  isAvailable   Boolean             @default(true)
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  category      ProductCategory     @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  bundleItems   PackageBundleItem[]

  @@index([categoryId])
}

model PackageBundle {
  id          String              @id @default(uuid())
  name        String              // e.g. "Paket Sembako Berkah Lebaran"
  slug        String              @unique
  description String?
  bundlePrice Decimal             @db.Decimal(12, 2)
  imageUrl    String?
  isActive    Boolean             @default(true)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  items       PackageBundleItem[]
  savings     MemberSaving[]
}

model PackageBundleItem {
  id          String        @id @default(uuid())
  bundleId    String
  itemId      String
  quantity    Int           @default(1)

  bundle      PackageBundle @relation(fields: [bundleId], references: [id], onDelete: Cascade)
  item        ProductItem   @relation(fields: [itemId], references: [id], onDelete: Restrict)

  @@unique([bundleId, itemId])
}

model MemberSaving {
  id                  String               @id @default(uuid())
  userId              String
  cycleId             String
  programId           String
  bundleId            String?
  status              SavingsStatus        @default(ACTIVE)
  notes               String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  user                User                 @relation(fields: [userId], references: [id], onDelete: Restrict)
  cycle               SavingsCycle         @relation(fields: [cycleId], references: [id], onDelete: Restrict)
  program             SavingsProgram       @relation(fields: [programId], references: [id], onDelete: Restrict)
  bundle              PackageBundle?       @relation(fields: [bundleId], references: [id], onDelete: SetNull)

  ledgers             WeeklyLedger[]
  withdrawals         EmergencyWithdrawal[]
  distributionPayout  DistributionPayout?

  @@unique([userId, cycleId, programId])
  @@index([userId])
  @@index([cycleId])
  @@index([status])
}

model WeeklyLedger {
  id             String        @id @default(uuid())
  memberSavingId String
  weekNumber     Int           // Minggu ke 1..50
  dueDate        DateTime
  paidDate       DateTime?
  amount         Decimal       @db.Decimal(12, 2)
  paymentMethod  PaymentMethod @default(CASH)
  proofImageUrl  String?
  status         LedgerStatus  @default(PENDING_PAYMENT)
  verifiedById   String?
  verifiedAt     DateTime?
  rejectionReason String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  memberSaving   MemberSaving  @relation(fields: [memberSavingId], references: [id], onDelete: Cascade)

  @@unique([memberSavingId, weekNumber])
  @@index([memberSavingId])
  @@index([status])
}

model EmergencyWithdrawal {
  id              String            @id @default(uuid())
  memberSavingId  String
  userId          String
  amount          Decimal           @db.Decimal(12, 2) // Max 500000.00
  reason          String
  status          WithdrawalStatus  @default(PENDING_APPROVAL)
  proofImageUrl   String?           // Bukti transfer pengembalian uang dari admin
  approvedById    String?
  approvedAt      DateTime?
  rejectionReason String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  memberSaving    MemberSaving      @relation(fields: [memberSavingId], references: [id], onDelete: Cascade)
  user            User              @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([memberSavingId])
  @@index([userId])
  @@index([status])
}

model DistributionPayout {
  id                     String        @id @default(uuid())
  memberSavingId         String        @unique
  totalSavedAmount       Decimal       @db.Decimal(12, 2)
  adminFeeAmount         Decimal       @db.Decimal(12, 2)
  packageGoodsAmount     Decimal       @db.Decimal(12, 2)
  emergencyDeductionAmount Decimal     @db.Decimal(12, 2)
  netPayoutAmount        Decimal       @db.Decimal(12, 2)
  payoutDate             DateTime
  isDisbursed            Boolean       @default(false)
  disbursedAt            DateTime?
  disbursedById          String?
  notes                  String?
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  memberSaving           MemberSaving  @relation(fields: [memberSavingId], references: [id], onDelete: Cascade)

  @@index([isDisbursed])
}

model AdminAuditLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // e.g. "VERIFY_PAYMENT", "QUICK_CASH_ENTRY", "APPROVE_WITHDRAWAL"
  entityName  String
  entityId    String
  oldValues   Json?
  newValues   Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  admin       User     @relation(fields: [adminId], references: [id], onDelete: Restrict)

  @@index([adminId])
  @@index([entityName, entityId])
}
```

---

### 6.2 Supabase Infrastructure & Connection Details

- **Host:** `aws-0-ap-south-1.pooler.supabase.com`
- **Port Pooler (Transaction Mode):** `6543`
- **Port Direct (Migration Session):** `5432`
- **Database:** `postgres`
- **User:** `postgres.ztaasxrrmfrzzplmupjh`
- **Password:** `GHk6Npb6HahgsWH4`
- **Project URL:** `https://ztaasxrrmfrzzplmupjh.supabase.co`

```env
# Runtime connection via PgBouncer Pooler (Port 6543)
DATABASE_URL="postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for Prisma Migrations (Port 5432)
DIRECT_URL="postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://ztaasxrrmfrzzplmupjh.supabase.co"
```

---

### 6.3 Backend API Endpoints (`apps/api`)

#### 1. Auth & Profile Endpoints (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Registrasi nasabah baru.
- `POST /api/v1/auth/login` — Login nasabah / admin & return JWT Token.
- `GET /api/v1/auth/me` — Ambil profil & role user aktif.
- `POST /api/v1/auth/logout` — Revoke token session.

#### 2. Nasabah PWA Endpoints (`/api/v1/nasabah`)
- `GET /api/v1/nasabah/savings` — Data tabungan aktif nasabah.
- `GET /api/v1/nasabah/savings/:id/ledger` — Data 50 minggu kartu absensi setoran nasabah.
- `POST /api/v1/nasabah/savings/:id/pay-week` — Upload foto bukti transfer setoran.
- `GET /api/v1/nasabah/savings/:id/simulation` — Simulasi real-time payout H-1 Idul Fitri.
- `POST /api/v1/nasabah/withdrawals/request` — Permohonan penarikan darurat (Max 500k guard).
- `GET /api/v1/nasabah/savings/:id/receipt/:weekNumber` — Unduh kwitansi digital resmi berstempel.

#### 3. Admin Console Endpoints (`/api/v1/admin`) — *Admin Role Required*
- `GET /api/v1/admin/dashboard/summary` — Statistik KPI (Total Kas, Nasabah, Antrean, Klaim Darurat).
- `GET /api/v1/admin/ledgers/matrix` — **Matriks Absensi 50 Minggu Seluruh Nasabah** dalam 1 query teroptimasi.
- `POST /api/v1/admin/ledgers/quick-cash` — **Setor Tunai Cepat (Quick Cash Entry)** tanpa perlu foto bukti.
- `GET /api/v1/admin/ledgers/pending` — Antrean verifikasi bukti transfer mingguan.
- `PATCH /api/v1/admin/ledgers/:id/verify` — Approve / Reject bukti setoran mingguan.
- `POST /api/v1/admin/broadcast/whatsapp-reminder` — Pemicu broadcast pengingat WA nasabah menunggak.
- `GET /api/v1/admin/withdrawals` — Daftar permohonan penarikan darurat (`PENDING_APPROVAL`).
- `PATCH /api/v1/admin/withdrawals/:id/decision` — Approve / Reject penarikan darurat nasabah.
- `POST /api/v1/admin/distribution/calculate-batch` — Kalkulasi batch payout seluruh nasabah untuk H-1 Lebaran.
- `GET /api/v1/admin/reports/manifest-export` — Export manifest pembagian ke Excel (`.xlsx`) / PDF.

#### 4. Master Data CRUD (`/api/v1/admin/master/*`) — *Zero Hardcode Engine*
- `CRUD /api/v1/admin/master/cycles` — Kelola tahun siklus (1447H, Tanggal Mulai & Akhir).
- `CRUD /api/v1/admin/master/programs` — Kelola program tabungan (100k, 50k, 25k, custom) & biaya admin.
- `CRUD /api/v1/admin/master/categories` — Kelola kategori produk (Sembako, Kue, Perabotan).
- `CRUD /api/v1/admin/master/items` — Kelola item produk individual (Daging, Minyak, Telur, Toples).
- `CRUD /api/v1/admin/master/bundles` — Kelola bundling paket parcel Lebaran.

---

## 7. Quality Assurance & Testing Strategy (`/qa`)

Berdasarkan prinsip **Shift-Left Testing**, tim QA telah menyusun matriks uji komprehensif:

### 7.1 Matriks Uji Finansial & Bisnis

| ID Kasus | Deskripsi Skenario Uji | Input Data | Hasil yang Diharapkan | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **TC-FIN-01** | Hitung Pembagian Normal (Lunas 50 Minggu) | Tabungan: 50 x 100k (5jt), Admin: 25k, Paket: 318k, Darurat: 0 | Payout Bersih: Rp 4.657.000 + Status Barang 'SIAP_DISTRIBUSI'. | **P0 (Critical)** |
| **TC-FIN-02** | Hitung Pembagian dengan Penarikan Darurat Maksimal | Tabungan: 5jt, Admin: 25k, Paket: 318k, Penarikan: 500k | Payout Bersih: Rp 4.157.000. | **P0 (Critical)** |
| **TC-FIN-03** | Pembayaran Parsial (Menunggak 5 Minggu) | Terbayar: 45 x 100k (4.5jt), Admin: 25k, Paket: 318k, Darurat: 0 | Payout Bersih: Rp 4.157.000 (Sistem mencatat 5 minggu belum dibayar). | **P0 (Critical)** |
| **TC-FIN-04** | Saldo Tabungan Tidak Cukup untuk Paket Barang | Tabungan: 300k, Admin: 25k, Paket Barang: 400k | Alert: Saldo tabungan tidak mencukupi paket barang pilihan. | **P0 (Critical)** |
| **TC-EMG-01** | Penarikan Darurat Melebihi Limit Rp 500.000 | Request Penarikan: Rp 500.001 | Ditolak Guard Clause Backend (`400 Bad Request: Maksimal Rp 500.000`). | **P0 (Critical)** |
| **TC-EMG-02** | Percobaan Penarikan Darurat Kedua Kali | User telah sukses withdraw 500k, submit request baru | Ditolak (`400 Bad Request: Batas frekuensi 1x tercapai`). | **P0 (Critical)** |
| **TC-EMG-03** | Penarikan Darurat saat Saldo Belum Cukup | Saldo: 300k, Request Penarikan: 500k | Ditolak (`400 Bad Request: Saldo berjalan tidak mencukupi`). | **P0 (Critical)** |
| **TC-MAT-01** | Performa Query Matriks Absensi 50 Minggu | Query 50 nasabah x 50 minggu | Query selesai dalam waktu < 200ms tanpa N+1 query. | **P1 (High)** |
| **TC-MAT-02** | Quick Cash Entry oleh Admin | Klik centang tunai minggu ke-19 nasabah A | Status instan menjadi `VERIFIED`, total kas bertambah, dan streak nasabah naik. | **P1 (High)** |
| **TC-IDOR-01** | Proteksi IDOR Akses Ledger Nasabah Lain | Nasabah A request `/api/v1/nasabah/savings/:idB/ledger` | Respons `403 Forbidden: Anda tidak memiliki akses ke tabungan ini`. | **P0 (Critical)** |

---

## 8. Implementation Roadmap & Milestones

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       NABUNGID DEVELOPMENT ROADMAP                                     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ MILESTONE 1: Core Foundation & 3D Landing Page ]  ──▶ SELESAI (3D Ayam, Calculator, Monorepo)        │
│ [ MILESTONE 2: PWA Nasabah & Kartu Absensi Stamp ]   ──▶ SELESAI (WeeklyCheckinCard, Dashboard, Payout) │
│ [ MILESTONE 3: Admin Console & Master Data Engine ] ──▶ SELESAI (CRUD Dinamis, Verifikasi, Payout H-1) │
│ [ MILESTONE 4: Admin Matrix Attendance & Quick Cash] ──▶ TAHAP BERIKUTNYA (/admin/absensi & WA Blast) │
│ [ MILESTONE 5: Database Live Migration & Seeding ]  ──▶ TAHAP BERIKUTNYA (Supabase PostgreSQL Sync)   │
│ [ MILESTONE 6: Automated Test Suite & Production ]  ──▶ TAHAP AKHIR (Vitest, Lighthouse, Vercel Deploy)│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
