# PRD: NabungID — Platform Monorepo Tabungan Idul Fitri & Paket Hari Raya Terintegrasi

**Product:** NabungID (Aplikasi Tabungan Hari Raya & Paket Lebaran Berkelanjutan)  
**Author:** Lead Product Manager & Architecture Squad (`/pm`, `/frontend`, `/backend`, `/qa`)  
**Date:** 2026-08-31  
**Version:** v1.0.0  
**Status:** Approved & Ready for Implementation  
**Architecture:** Turborepo Monorepo (`apps/web`, `apps/api`, `packages/shared`)  

---

## 1. Executive Summary

**NabungID** adalah platform tabungan komunitas modern berbasis Progressive Web App (PWA) dan API terpusat yang dirancang khusus untuk memfasilitasi program tabungan berkala (mingguan) menuju Hari Raya Idul Fitri selama 1 tahun penuh. Program tabungan dimulai secara otomatis pada **H+1 minggu setelah Idul Fitri** dan dicairkan pada **H-1 minggu sebelum Idul Fitri tahun berikutnya** (~48 hingga 50 minggu siklus fleksibel).

Platform ini mengintegrasikan:
1. **Fleksibilitas Paket Tabungan:** Pilihan nominal setoran mingguan dinamis (contoh standar: Rp 100.000/minggu, serta variasi Rp 25.000, Rp 50.000, Rp 200.000, atau custom nominal via Admin Panel).
2. **Katalog Paket Barang/Hampers Dinamis:** Integrasi paket sembako/bahan mentah (daging sapi/ayam, minyak goreng, telur, beras), snack/kue kaleng Lebaran, dan perabotan rumah tangga yang harganya diakumulasikan dan dikurangkan otomatis dari total tabungan akhir.
3. **Formula Distribusi Transparan:** `Dana Akhir Diterima = Total Tabungan - Biaya Admin (Dinamis) - Total Harga Paket Barang Terpilih - Total Penarikan Darurat`.
4. **Fitur Penarikan Darurat Terkontrol (Emergency Withdrawal):** Nasabah dapat menarik dana tabungan darurat sebelum waktu pembagian tanpa potongan komisi/penalti, dengan aturan tegas: **Maksimal Rp 500.000 dan hanya dapat dilakukan 1x** per siklus tabungan.
5. **High-Conversion Landing Page & Dual Role Management:** Antarmuka publik yang memukau (UI/UX Pro Max dengan Glassmorphism dan kalkulator interaktif), Role Nasabah yang intuitif, serta Admin Panel komprehensif tanpa data *hardcoded*.

---

## 2. Problem Statement & Business Opportunity

### 2.1 Latar Belakang (Background)
Tradisi menabung untuk keperluan Hari Raya Idul Fitri (uang saku hari raya, hampers sembako, kue kaleng, dan perlengkapan rumah tangga) sangat masif di masyarakat Indonesia. Namun, sebagian besar program tabungan RT/RW, arisan, atau kelompok pengajian masih dikelola secara manual menggunakan buku kas fisik, kartu iuran kertas, atau spreadsheet rawan manipulasi.

### 2.2 Permasalahan Utama (Core Problems)
> **Problem:** Pengelolaan tabungan Lebaran manual menimbulkan ketidakpastian saldo, risiko salah hitung biaya admin dan paket barang, sulitnya pencatatan penarikan darurat, serta hilangnya transparansi pencairan dana di H-1 minggu menjelang Idul Fitri.
> 
> **Target Pengguna Terdampak:** Nasabah/Anggota penabung keluarga/komunitas dan Pengelola Tabungan (Admin/Koordinator).
> 
> **Dampak Negatif:** Sering terjadi selisih kas, komplain nasabah saat pembagian parcel/uang tunai, dan ketidakmampuan nasabah memantau sisa target tabungan mereka secara *real-time*.

### 2.3 Evidence & Matrix Kebutuhan

| Masalah Riil | Kebutuhan Solusi di NabungID | Dampak Solusi |
| :--- | :--- | :--- |
| Buku iuran hilang / rusak | Buku tabungan digital PWA (*Mobile-First*) dengan riwayat per minggu | Kepercayaan nasabah meningkat 100%, data aman di Cloud PostgreSQL |
| Paket sembako tidak fleksibel | Sistem Katalog Master Data Barang & Bundling Paket fleksibel di Admin | Nasabah bisa memilih barang/sembako sesuai selera & budget |
| Kebutuhan mendadak di tengah tahun | Penarikan Darurat max Rp 500.000 (1x penarikan, 0% potongan) | Likuiditas darurat bagi nasabah tanpa merusak sistem tabungan |
| Perhitungan akhir rumit | Otomatisasi kalkulasi `Tabungan - Admin - Paket - Tarik Darurat` | Rekap pembagian selesai dalam 1 klik tanpa salah hitung |

---

## 3. Target User Personas & Role Matrix

### 3.1 Role 1: Nasabah / Pelanggan (Customer Persona)
- **Profil:** Ibu Rumah Tangga, Pekerja, atau Anggota Komunitas berusia 20–55 tahun.
- **Karakteristik Perangkat:** Mayoritas menggunakan Smartphone (Android/iOS) dengan koneksi mobile data.
- **Tujuan Utama:**
  - Menabung secara konsisten tiap minggu (misal Rp 100.000/minggu) tanpa terasa berat.
  - Memilih paket hampers Lebaran (sembako daging/minyak/telur, kue kaleng, perabotan).
  - Memantau akumulasi saldo dan sisa minggu tabungan dengan indikator visual.
  - Mengajukan penarikan darurat ketika ada kebutuhan mendesak (maksimal Rp 500.000, 1x).
  - Menerima rincian uang sisa dan paket sembako di H-1 minggu Idul Fitri.

### 3.2 Role 2: Pengelola / Admin (Admin Persona)
- **Profil:** Koordinator Tabungan, Pengurus Koperasi, atau Pemilik Bisnis Paket Lebaran.
- **Karakteristik Perangkat:** Desktop / Laptop / Tablet untuk operasional harian.
- **Tujuan Utama:**
  - Mengonfigurasi siklus tabungan (Periode H+1 Idul Fitri s.d. H-1 Idul Fitri berikutnya).
  - Mengelola master data nominal paket mingguan (Rp 25k, Rp 50k, Rp 100k, Rp 200k, custom).
  - Mengelola katalog item barang (sembako mentah, kue, perabotan) dan menyusun bundling paket.
  - Mengatur biaya administrasi program (fixed nominal atau persentase).
  - Mencatat / memverifikasi setoran mingguan nasabah (manual input atau upload bukti transfer).
  - Menyetujui atau menolak permohonan penarikan darurat nasabah.
  - Melakukan *batch calculation disbursement* dan mencetak bukti tanda terima pembagian.

### 3.3 Role-Based Access Control (RBAC) Matrix

| Fitur / Modul | Public / Guest | Nasabah (Pelanggan) | Admin (Pengelola) |
| :--- | :---: | :---: | :---: |
| Landing Page & Simulasi Tabungan | ✅ View Only | ✅ View & Simulate | ✅ View & Simulate |
| Registrasi & Login (Better Auth + JWT) | ✅ Akses | ✅ Akses | ✅ Akses |
| Pendaftaran Program Tabungan Baru | ❌ | ✅ Self-Service | ✅ Create on Behalf |
| Monitoring Progres Tabungan & Ledger Mingguan | ❌ | ✅ Data Milik Sendiri | ✅ Semua Nasabah |
| Request Penarikan Darurat (Max 500rb, 1x) | ❌ | ✅ Submit Form | ✅ Review & Approve |
| Master Data Program, Siklus & Biaya Admin | ❌ | ❌ | ✅ Full CRUD |
| Master Data Item Barang & Bundling Paket | ❌ | ❌ | ✅ Full CRUD |
| Verifikasi / Catat Setoran Mingguan | ❌ | ❌ (Hanya kirim bukti) | ✅ Verifikasi & Entry |
| Eksekusi Pembagian Dana & Cetak Manifest H-1 | ❌ | ✅ View Rincian Akhir | ✅ Eksekusi & Export PDF/Excel |
| Audit Trail & Log Keuangan | ❌ | ❌ | ✅ Read-Only Log |

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
2. **Biaya Admin:** Nilai biaya administrasi yang diatur oleh Admin pada program tabungan terkait (bisa nominal tetap misal Rp 20.000/siklus atau persentase).
3. **Total Nilai Paket Barang:** Akumulasi harga barang yang dipilih nasabah (contoh: Paket Sembako Premium seharga Rp 350.000 berisi Daging 1kg, Telur 1 tray, Minyak 2L, Beras 5kg, Syrup).
4. **Total Penarikan Darurat:** Total nominal uang yang ditarik lebih awal oleh nasabah selama periode berjalan (maksimal Rp 500.000).

#### Contoh Kasus Nyata:
- Nasabah menabung paket **Rp 100.000 / minggu** selama **50 minggu**.
  - Total Tabungan: $50 \times \text{Rp } 100.000 = \text{Rp } 5.000.000$
  - Biaya Admin Program: $\text{Rp } 25.000$
  - Paket Barang Terpilih: Paket Sembako & Kue Kaleng seharga $\text{Rp } 450.000$
  - Penarikan Darurat (Bulan ke-6): $\text{Rp } 500.000$ (1x limit)
- **Rincian Pembagian pada H-1 Minggu Idul Fitri:**
  - Hak Barang: 1 Paket Sembako & Kue Kaleng.
  - Uang Tunai Diterima: $\text{Rp } 5.000.000 - \text{Rp } 25.000 - \text{Rp } 450.000 - \text{Rp } 500.000 = \mathbf{\text{Rp } 4.025.000}$.

---

### 4.3 Aturan Ketat Penarikan Darurat (Emergency Withdrawal Policy)

Untuk menjaga likuiditas kas dan kedisiplinan menabung, sistem menerapkan aturan validasi bisnis (*Business Rules Guard*):

1. **Bebas Komisi / Penalti (0% Fee):** Penarikan tidak dikenakan potongan denda apa pun.
2. **Batas Nominal Maksimal:** Total penarikan darurat **tidak boleh melebihi Rp 500.000**.
3. **Batas Frekuensi Transaksi:** Nasabah hanya dapat menarik dana darurat **maksimal 1 (satu) kali** per program tabungan jika nominal yang diambil mencapai batas limit (atau pengambilan parsial menghabiskan kuota 1x transaksi sesuai konfigurasi kebijakan).
4. **Validasi Saldo Berjalan (*Minimum Safe Balance Guard*):**
   - Saldo terkumpul saat pengajuan harus lebih besar dari nominal penarikan yang diminta + estimasi biaya admin + perkiraan minimal cadangan paket.
   - Formula Validasi: $\text{Saldo Terverifikasi} \ge \text{Nominal Pengajuan} + \text{Biaya Admin}$.
5. **Alur Approval Admin:** Permintaan penarikan berstatus `PENDING_APPROVAL` $\rightarrow$ Admin memeriksa dan menyetujui (`APPROVED`) atau menolak (`REJECTED` dengan alasan) $\rightarrow$ Admin mentransfer dana / menyerahkan tunai dan mengunggah bukti disbursement $\rightarrow$ Status berubah menjadi `COMPLETED`.

---

### 4.4 Master Data Dinamis & Zero Hardcode Policy

Sesuai standar arsitektur `/pm` & `/backend`, seluruh entitas bisnis dikelola dinamis di database PostgreSQL via Admin Panel tanpa hardcode enum di kode program:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DYNAMIC MASTER DATA ENGINE                      │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. SavingsProgram              │ - Nominal Mingguan (25k, 50k, 100k,…) │
│                                │ - Durasi Minggu Target                │
│                                │ - Default Admin Fee                   │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. ProductCategory             │ - Sembako Mentah (Daging, Telur, dll) │
│                                │ - Makanan & Snack (Kue Kaleng, Sirup) │
│                                │ - Perabotan & Home Living             │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. ProductItem                 │ - Nama Barang, Satuan, Estimasi Harga │
│                                │ - Foto Barang, Stok Tersedia          │
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

Aplikasi dibangun menggunakan arsitektur **Turborepo Monorepo** untuk memastikan skalabilitas, efisiensi *build pipeline*, dan penggunaan tipe data terpadu (*Single Source of Truth*).

```
nabungid/
├── apps/
│   ├── web/                        # Next.js 14/15 (App Router) + PWA Frontend
│   │   ├── app/
│   │   │   ├── (auth)/             # Login, Register, Forgot Password
│   │   │   ├── (public)/           # High-Converting Landing Page, Simulasi
│   │   │   ├── (nasabah)/          # Dashboard Nasabah, Ledger, Paket, Penarikan
│   │   │   └── (admin)/            # Admin Console, Master Data, Verifikasi, Payout
│   │   ├── components/             # Shadcn UI, Untitled UI, Custom Widgets
│   │   ├── hooks/                  # Custom Hooks dengan Result Pattern
│   │   ├── stores/                 # Zustand Global State (Auth, UI, Cart/Paket)
│   │   ├── styles/                 # Tailwind CSS & Design Tokens
│   │   └── next.config.mjs         # PWA Configuration (next-pwa / serwist)
│   │
│   └── api/                        # Express.js + TypeScript REST Backend
│       ├── src/
│       │   ├── config/             # Env, Database, Supabase Client
│       │   ├── controllers/        # Request Handlers
│       │   ├── services/           # Core Domain & Financial Calculation Logic
│       │   ├── middleware/         # Auth Guard (JWT RBAC), Validation, Error Handler
│       │   ├── routes/             # REST Endpoints (/api/v1/...)
│       │   ├── exceptions/         # Custom Domain Exceptions
│       │   └── utils/              # Result Pattern & Logger (Winston/Pino)
│       ├── prisma/
│       │   ├── schema.prisma       # Prisma Database Models
│       │   └── migrations/         # Supabase PostgreSQL Migrations
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                     # Shared Library
│   │   ├── src/
│   │   │   ├── types/              # DTOs, Enums, Entity Interfaces
│   │   │   ├── schemas/            # Zod Validation Schemas
│   │   │   ├── constants/          # App-wide Constants
│   │   │   └── utils/              # Calculation Helpers (Payout, Cycle dates)
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
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
  name        String        @unique // Sembako, Kue Kaleng, Perabotan, Daging/Ayam
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
  name          String              // e.g. "Daging Sapi Segar 1 Kg", "Biskuit Khong Guan 1600g"
  unit          String              // "Kg", "Kaleng", "Liter", "Pcs"
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
  name        String              // e.g. "Paket Sembako Lengkap", "Paket Kue & Snack Lebaran"
  slug        String              @unique
  description String?
  bundlePrice Decimal             @db.Decimal(12, 2) // Total harga paket
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
  bundleId            String?              // Paket barang pilihan nasabah (opsional)
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
  totalSavedAmount       Decimal       @db.Decimal(12, 2) // Total akumulasi uang masuk
  adminFeeAmount         Decimal       @db.Decimal(12, 2) // Potongan admin
  packageGoodsAmount     Decimal       @db.Decimal(12, 2) // Potongan harga paket barang
  emergencyDeductionAmount Decimal     @db.Decimal(12, 2) // Potongan penarikan darurat
  netPayoutAmount        Decimal       @db.Decimal(12, 2) // Total bersih yang dibagikan
  payoutDate             DateTime      // Waktu H-1 Idul Fitri
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
  action      String   // e.g. "VERIFY_PAYMENT", "APPROVE_WITHDRAWAL", "UPDATE_MASTER_PACKAGE"
  entityName  String   // "WeeklyLedger", "EmergencyWithdrawal", "PackageBundle"
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

### 6.2 Backend API Contracts (`apps/api`)

Seluruh endpoint backend mengadopsi standar **Safe Logic Flow**, **Guard Clauses**, **Result Pattern**, dan **JWT Auth Guard**.

#### 1. Authentication Endpoints (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Registrasi nasabah baru (Zod: `name`, `phoneNumber`, `email`, `password`).
- `POST /api/v1/auth/login` — Autentikasi user & pengembalian HTTP-Only Refresh Token + Short-lived Access Token JWT.
- `GET /api/v1/auth/me` — Ambil profile & active role user yang sedang login.
- `POST /api/v1/auth/logout` — Revoke token & clear session.

#### 2. Public & Nasabah Program Endpoints (`/api/v1/programs`)
- `GET /api/v1/programs/active` — Mengambil program & siklus tabungan yang sedang aktif untuk landing page.
- `GET /api/v1/programs/catalog-packages` — Mengambil katalog paket sembako/snack/perabotan yang tersedia.
- `POST /api/v1/nasabah/enroll` — Nasabah mendaftar program tabungan & memilih paket barang (Auth Nasabah).
- `GET /api/v1/nasabah/savings` — Mengambil riwayat & kartu status tabungan aktif milik nasabah.
- `GET /api/v1/nasabah/savings/:id/ledger` — Mengambil rincian 50 minggu setoran, tanggal jatuh tempo, dan status verifikasi.
- `POST /api/v1/nasabah/savings/:id/pay-week` — Upload bukti pembayaran untuk minggu tertentu.
- `GET /api/v1/nasabah/savings/:id/simulation` — Simulasi proyeksi saldo pembagian H-1 Idul Fitri secara *real-time*.

#### 3. Emergency Withdrawal Endpoints (`/api/v1/withdrawals`)
- `POST /api/v1/nasabah/withdrawals/request` — Mengajukan penarikan darurat (Maks Rp 500.000, 1x limit guard).
- `GET /api/v1/nasabah/withdrawals/status` — Memeriksa sisa limit dan status pengajuan penarikan darurat.

#### 4. Admin Management & Verification Endpoints (`/api/v1/admin`) — *Admin Role Required*
- `GET /api/v1/admin/dashboard/summary` — Statistik total dana terhimpun, total nasabah, tunggakan, dan penarikan darurat.
- `GET /api/v1/admin/ledgers/pending` — Daftar setoran mingguan nasabah yang menunggu verifikasi admin.
- `PATCH /api/v1/admin/ledgers/:id/verify` — Verifikasi atau tolak setoran mingguan nasabah.
- `GET /api/v1/admin/withdrawals` — Daftar permohonan penarikan darurat (`PENDING_APPROVAL`).
- `PATCH /api/v1/admin/withdrawals/:id/decision` — Approve / Reject penarikan darurat dengan upload bukti transfer.
- `POST /api/v1/admin/distribution/calculate-batch` — Kalkulasi otomatis pembagian dana seluruh nasabah untuk H-1 Idul Fitri.
- `PATCH /api/v1/admin/distribution/:id/disburse` — Tandai dana dan barang telah diserahkan ke nasabah.
- `GET /api/v1/admin/reports/manifest-export` — Export data manifest pembagian ke Excel / PDF.

#### 5. Admin Dynamic Master Data CRUD (`/api/v1/admin/master`) — *Zero Hardcode Policy*
- `CRUD /api/v1/admin/master/cycles` — Kelola siklus tabungan (Tahun Hijriah, Tanggal H+1, Tanggal H-1).
- `CRUD /api/v1/admin/master/programs` — Kelola nominal tabungan (100k, 50k, custom) & biaya admin program.
- `CRUD /api/v1/admin/master/categories` — Kelola kategori produk barang (Sembako, Kue, Perabotan).
- `CRUD /api/v1/admin/master/items` — Kelola item produk individual (Daging, Minyak, Telur, Toples, dll).
- `CRUD /api/v1/admin/master/bundles` — Kelola paket bundling barang & penetapan total harga paket.

---

### 6.3 Frontend UX/UI Architecture (`apps/web`)

Sesuai panduan **UI/UX Pro Max** dan **Mobile & Tablet First Priority**:

```
                                  [ LANDING PAGE PUBLIK ]
                                (Glassmorphism, Dark/Light,
                                 Kalkulator Interaktif 100k,
                                 Katalog Sembako & Perabot)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [ DASHBOARD NASABAH (PWA) ]                [ ADMIN MANAGEMENT PORTAL ]
            - Progress Ring 50 Minggu                   - Stat KPI Cards (Total Kas, Pending)
            - Kartu Setoran Mingguan Interaktif         - Verifikasi Setoran Quick-Action
            - Selector Paket Barang                     - Modal Approval Penarikan Darurat
            - Form Tarik Darurat (Max 500k Guard)       - Master Data Manager (Zero Hardcode)
            - Rincian Akhir Payout H-1                  - Batch Distribution Engine & Export
```

#### 1. Visual Design & Theme System (UI/UX Pro Max)
- **Design Style:** Modern Clean Glassmorphism dengan aksen Keberkahan & Kemakmuran.
- **Color Palette:**
  - *Primary Emerald:* `hsl(158, 64%, 28%)` (#0F5132) & `hsl(160, 84%, 39%)` (#059669) — Melambangkan ketenangan, keberkahan finansial, dan identitas Idul Fitri.
  - *Accent Warm Gold:* `hsl(38, 92%, 50%)` (#F59E0B) & `hsl(32, 95%, 44%)` (#D97706) — Melambangkan tabungan bernilai dan hadiah Hari Raya.
  - *Background Dark:* `hsl(222, 47%, 11%)` (#0B0F17) / Surface: `hsl(217, 33%, 17%)` (#1E293B).
  - *Background Light:* `hsl(210, 40%, 98%)` (#F8FAFC) / Surface: `hsl(0, 0%, 100%)` (#FFFFFF).
- **Typography:** **Plus Jakarta Sans** (Primary Heading & Body) dipadukan dengan font angka tabular monospaced untuk rincian nominal keuangan.
- **Icons:** Resmi menggunakan **Lucide React SVG Icons** (Bebas emoji di UI).

#### 2. Public High-Conversion Landing Page Structure
1. **Hero Section:** Headline emosional *"Lebaran Tenang Tanpa Pusing Biaya: Nabung 100rb per Minggu, Panen Berkah & Paket Sembako di Hari Raya"*, dilengkapi call-to-action (CTA) mencolok *"Mulai Menabung Sekarang"* dan visual mockup interaktif.
2. **Interactive Savings & Hampers Calculator:**
   - Slider nominal mingguan (Rp 25.000 s.d. Rp 500.000).
   - Selector paket barang (Sembako Premium, Kue Kaleng, Perabot Dapur).
   - Hasil kalkulasi visual instan: Total Saldo di H-1, Nilai Paket Barang, Estimasi Dana Tunai yang Dibawa Pulang.
3. **Showcase Paket Barang Lebaran:** Carousel interaktif berisi foto barang berkualitas tinggi (Daging sapi segar, Minyak goreng, Telur, Kue kaleng premium, Set perabotan dapur).
4. **Alur Transparan (Timeline Visualizer):** Infografis visual perjalanan 50 minggu dari H+1 Idul Fitri hingga H-1 Idul Fitri berikutnya.
5. **Fitur Emergency Withdrawal Explainer:** Penjelasan transparan hak penarikan darurat maksimal Rp 500.000 (1x) tanpa potongan penalti.
6. **Social Proof, Trust Badges, & FAQ Interaktif:** Testimoni nasabah, garansi transparansi kas, dan akordeon FAQ.

#### 3. Nasabah PWA Experience
- **Mobile-First Tab Bar:** Beranda, Tabunganku, Katalog Paket, Penarikan, Profil.
- **Visual Milestone Tracker:** Circular progress ring & strip 50 kartu mingguan dengan badge status (`Lunas`, `Menunggu Verifikasi`, `Belum Bayar`).
- **Emergency Withdrawal Modal:** Form penarikan dengan real-time validator guard yang otomatis mendisable tombol submit jika saldo kurang atau sudah pernah menarik Rp 500.000.

---

## 7. Quality Assurance & Testing Strategy (`/qa`)

Berdasarkan prinsip **Shift-Left Testing**, tim QA telah menyusun matriks uji komprehensif untuk mencegah celah keamanan, salah hitung finansial, dan kesalahan logika data (*data misconception*).

### 7.1 Financial Calculation & Business Logic Test Matrix

| ID Kasus | Deskripsi Skenario Uji | Input Data | Hasil yang Diharapkan (Expected Outcome) | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **TC-FIN-01** | Hitung Pembagian Normal (Lunas 50 Minggu) | Tabungan: 50 x 100k (5jt), Admin: 25k, Paket: 400k, Penarikan: 0 | Payout Bersih: Rp 4.575.000 + Status Barang 'SIAP_DISTRIBUSI'. | **P0 (Critical)** |
| **TC-FIN-02** | Hitung Pembagian dengan Penarikan Darurat Maksimal | Tabungan: 5jt, Admin: 25k, Paket: 400k, Penarikan Darurat: 500k | Payout Bersih: Rp 4.075.000. | **P0 (Critical)** |
| **TC-FIN-03** | Pembayaran Parsial (Menunggak 5 Minggu) | Terbayar: 45 x 100k (4.5jt), Admin: 25k, Paket: 400k, Penarikan: 0 | Payout Bersih: Rp 4.075.000 (Sistem mencatat 5 minggu belum dibayar). | **P0 (Critical)** |
| **TC-FIN-04** | Saldo Tabungan Tidak Cukup untuk Paket Barang | Tabungan: 300k, Admin: 25k, Paket Barang: 400k | Sistem mengeluarkan Alert: Dana tabungan tidak mencukupi paket barang pilihan. Admin/Nasabah dialihkan ke penyesuaian paket. | **P0 (Critical)** |
| **TC-EMG-01** | Penarikan Darurat Melebihi Limit Rp 500.000 | Request Penarikan: Rp 500.001 | Request ditolak oleh Guard Clause Backend (`400 Bad Request: Nominal melebihi limit maksimal Rp 500.000`). | **P0 (Critical)** |
| **TC-EMG-02** | Percobaan Penarikan Darurat Kedua Kali | User telah sukses withdraw 500k, submit request baru 200k | Request ditolak (`400 Bad Request: Batas frekuensi penarikan darurat (1x) telah tercapai`). | **P0 (Critical)** |
| **TC-EMG-03** | Penarikan Darurat saat Saldo Belum Cukup | Saldo: 300k, Request Penarikan: 500k | Request ditolak (`400 Bad Request: Saldo tabungan berjalan tidak mencukupi`). | **P0 (Critical)** |

---

### 7.2 Security, RBAC, & Zero Hardcode Audit Checklist

- [x] **IDOR Protection:** Endpoint `/api/v1/nasabah/savings/:id` memvalidasi kepemilikan data (`saving.userId === authenticatedUser.id`).
- [x] **RBAC Enforcement:** Seluruh endpoint `/api/v1/admin/*` dilindungi middleware `requireAdminRole`. Percobaan akses oleh nasabah menghasilkan `403 Forbidden`.
- [x] **Zero Hardcode Audit:** Data kategori barang, nominal paket mingguan, dan nama hampers 100% tersimpan di tabel database dan dapat diedit via UI Admin tanpa redeploy.
- [x] **Data Misconception Check:** Filter daftar tabungan nasabah di Admin Panel menyediakan opsi filter eksplisit: `Semua`, `Dengan Paket Barang`, `Tanpa Paket Barang (Uang Saja)`, dan `Memiliki Tunggakan`.

---

## 8. Implementation Roadmap & Milestones

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             PROJECT ROADMAP (6 WEEKS)                            │
├──────────────┬─────────────────────────────────────────────────┬─────────────────┤
│ Sprint       │ Fokus Deliverable                               │ Tim Terkait     │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 1** │ Inisialisasi Turborepo, Prisma Schema Supabase, │ Full-Stack      │
│ (Minggu 1)   │ Shared Zod DTOs, Better Auth & RBAC Setup       │ (/be, /fe)      │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 2** │ Core Backend Services (Ledger, Calculation      │ Backend & QA    │
│ (Minggu 2)   │ Engine, Emergency Withdrawal Guard Clauses)     │ (/be, /qa)      │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 3** │ Admin Dynamic Master Data APIs & Admin UI       │ Full-Stack      │
│ (Minggu 3)   │ (Paket, Barang, Sembako, Siklus, Admin Fee)     │ (/be, /fe)      │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 4** │ High-Converting Landing Page (UI/UX Pro Max),   │ Frontend & PM   │
│ (Minggu 4)   │ Interactive Calculator, PWA Nasabah Dashboard   │ (/fe, /pm)      │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 5** │ Nasabah Ledger Tracker, Form Tarik Darurat,     │ Full-Stack & QA │
│ (Minggu 5)   │ Verifikasi Setoran & Batch Payout Engine H-1    │ (/fe, /be, /qa) │
├──────────────┼─────────────────────────────────────────────────┼─────────────────┤
│ **Sprint 6** │ E2E Testing, Security & Load Audit, PWA Audit,  │ QA & Lead PM    │
│ (Minggu 6)   │ Deployment ke Vercel & Production Release       │ (/qa, /pm)      │
└──────────────┴─────────────────────────────────────────────────┴─────────────────┘
```

---

## 9. Success Metrics (KPIs)

1. **Conversion Rate Landing Page:** $\ge 12\%$ dari pengunjung landing page melakukan registrasi dan memilih program tabungan.
2. **Payment Compliance Rate:** $\ge 90\%$ nasabah melakukan setoran tepat waktu setiap minggunya melalui reminder PWA.
3. **Calculation Accuracy:** $100\%$ akurasi pada formula pembagian akhir H-1 Idul Fitri tanpa selisih kas 1 rupiah pun.
4. **System Response Time:** P95 API Latency $< 150\text{ ms}$, Core Web Vitals (LCP $< 1.8\text{ s}$, FID $< 100\text{ ms}$, CLS $< 0.05$).
5. **Emergency Withdrawal SLA:** Verifikasi permohonan penarikan darurat selesai dalam $< 24$ jam kerja oleh Admin.

---

## 10. Open Questions & Design Decisions

1. **Mekanisme Pembayaran Setoran Mingguan:** Apakah pada Fase 1 cukup dengan pencatatan manual oleh Admin + Upload bukti transfer oleh Nasabah, atau langsung diintegrasikan dengan Payment Gateway otomatis (Midtrans/Xendit QRIS)? *(Rekomendasi Fase 1: Manual + Bukti Transfer, Fase 2: Otomatisasi QRIS)*.
2. **Distribusi Barang Fisik (Logistik):** Apakah pengambilan paket sembako/perabotan dilakukan secara terpusat di kantor/posko koordinator, atau memerlukan integrasi tarif kurir ekspedisi pengantaran ke rumah? *(Rekomendasi Fase 1: Penjemputan di Posko/Pengambilan Terpusat oleh Nasabah)*.

---
*Dokumen PRD ini telah divalidasi dan disepakati oleh seluruh Lead Role (`/pm`, `/frontend`, `/backend`, `/qa`) sebagai acuan tunggal pengerjaan proyek NabungID.*
