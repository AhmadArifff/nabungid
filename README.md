# NabungID — Platform Tabungan Hari Raya & Paket Lebaran Terintegrasi

<div align="center">

![NabungID Banner](https://img.shields.io/badge/NabungID-Idul%20Fitri%201447H-emerald?style=for-the-badge&logo=cashapp&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](./LICENSE)
[![Author: Ahmad Arif](https://img.shields.io/badge/Author-Ahmad%20Arif-blue.svg?style=for-the-badge)](https://github.com/AhmadArifff)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Next.js PWA](https://img.shields.io/badge/Frontend-Next.js%2015%20PWA-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express Backend](https://img.shields.io/badge/Backend-Express.js%20TypeScript-38bdf8.svg?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-10b981.svg?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**Solusi Digital Manajemen Tabungan Komunitas 50 Minggu Menuju Idul Fitri yang Aman, Transparan, dan Otomatis.**

</div>

---

## 📑 Daftar Isi
1. [Tentang NabungID](#-tentang-nabungid)
2. [Formula Pembagian Bersih (PRD Standard)](#-formula-pembagian-bersih-prd-standard)
3. [Panduan Penggunaan Fitur (User Guide)](#-panduan-penggunaan-fitur-user-guide)
   - [A. Modul Publik & Landing Page](#a-modul-publik--landing-page)
   - [B. Modul Nasabah (Buku Tabungan PWA)](#b-modul-nasabah-buku-tabungan-pwa)
   - [C. Modul Administrator & Pengelola Kas](#c-modul-administrator--pengelola-kas)
4. [Arsitektur Monorepo & Teknologi](#-arsitektur-monorepo--teknologi)
5. [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
6. [Struktur Database Supabase Prisma](#-struktur-database-supabase-prisma)
7. [Lisensi & Hak Cipta](#-lisensi--hak-cipta)

---

## 📖 Tentang NabungID

**NabungID** dirancang khusus untuk memfasilitasi tradisi tahunan menabung persiapan Hari Raya Idul Fitri selama 1 tahun penuh (~50 minggu).
Program tabungan berjalan mulai **H+1 minggu setelah Idul Fitri** dan dicairkan tepat pada **H-1 minggu sebelum Idul Fitri berikutnya**.

Platform ini menggabungkan kemudahan aplikasi mobile **PWA (Progressive Web App)** dengan portal pengawasan administrasi untuk mencegah kekeliruan pencatatan manual, rekapitulasi paket sembako/kue kaleng, serta klaim dana darurat.

---

## 🧮 Formula Pembagian Bersih (PRD Standard)

Pada saat pencairan dana di **H-1 Idul Fitri**, sistem NabungID menghitung hak kas bersih nasabah secara transparan menggunakan formula standar:

$$\mathbf{Dana\ Bersih\ (Payout)} = \text{Total Tabungan} - \text{Biaya Admin} - \text{Harga Paket Barang} - \text{Total Tarik Darurat}$$

* **Total Tabungan:** Akumulasi setoran mingguan nasabah yang telah diverifikasi sah oleh admin (`status = VERIFIED`).
* **Biaya Admin:** Biaya pengelolaan program (default Rp 25.000 untuk 50 minggu).
* **Harga Paket Barang:** Nilai paket sembako/kue kaleng/perabotan yang dipilih nasabah.
* **Total Tarik Darurat:** Total dana yang telah dicairkan nasabah di tengah periode program (Maksimal Rp 500.000, 1x limit).

---

## 📱 Panduan Penggunaan Fitur (User Guide)

---

### A. Modul Publik & Landing Page

```
[ Navigasi Publik ] ────────> [ 3D Hero Celengan ] ────────> [ Kalkulator Real-time ]
           │                                                               │
           ▼                                                               ▼
[ Pasang PWA (Home Screen) ]                                    [ Rakit Parcel Lebaran ]
```

#### 1. Hitung Mundur Idul Fitri & 3D Interactive Hero
* **Tampilan:** Header dilengkapi counter waktu *real-time* (Hari : Jam : Menit : Detik) menuju Idul Fitri 1447H serta celengan kubah emas 3D interaktif yang berputar mengikuti gerakan kursor mouse / sentuhan layar sentuh.
* **Cara Menggunakan:**
  1. Klik atau arahkan kursor ke celengan 3D untuk memicu efek animasi koin emas.
  2. Klik tombol **"Mulai Menabung Sekarang"** untuk menuju halaman pendaftaran akun.

#### 2. Kalkulator Tabungan Interaktif & Proyeksi Pembagian
* **Tampilan:** Slider interaktif dengan nominal mingguan mulai dari Rp 25.000 hingga Rp 500.000, pemilih paket hampers, dan simulasi penarikan darurat.
* **Cara Menggunakan:**
  1. Geser tuas nominal atau pilih tombol cepat (cth: *Rp 100.000 / Minggu*).
  2. Pilih opsi paket barang (cth: *Paket Sembako Lengkap Rp 350.000*).
  3. Cek rincian *Sliding Number*: Sistem menampilkan total tabungan kotor (Rp 5.000.000), potongan admin (Rp 25.000), paket barang (Rp 350.000), dan **Uang Tunai Bersih Diterima di H-1 Lebaran (Rp 4.625.000)**.

#### 3. "Rakit Parcel Lebaran Impian" (Interactive Parcel Builder)
* **Tampilan:** Katalog kebutuhan pokok mentah (daging sapi 1kg, minyak 2L, telur 1kg), kue kaleng (Khong Guan), dan wajan granit.
* **Cara Menggunakan:**
  1. Klik tab kategori (*Sembako*, *Kue Kaleng*, *Perabotan*).
  2. Klik tombol **"+ Tambah ke Parcel"** pada barang yang diinginkan.
  3. Buka keranjang di sebelah kanan: Sistem menghitung total belanjaan parcel dan memberikan **rekomendasi nominal nabung mingguan** yang pas.

#### 4. Pemasangan Aplikasi PWA (Install Prompt)
* **Android / Chrome / Edge:** Banner otomatis muncul di bagian bawah layar; klik tombol **"Pasang Aplikasi"** untuk menginstal NabungID ke beranda HP.
* **iOS Safari (iPhone/iPad):** Klik tombol *Panduan iOS*, lalu tekan ikon **Share (Bagikan)** di Safari $\rightarrow$ pilih **"Add to Home Screen (Tambahkan ke Layar Utama)"**.

---

### B. Modul Nasabah (Buku Tabungan PWA)

```
[ Dashboard Nasabah ] ────> [ Kartu Absensi 50 Minggu ] ────> [ Upload Bukti Transfer ]
           │                                                               │
           ▼                                                               ▼
[ Pilih Paket Lebaran ] ──> [ Klaim Dana Darurat (Max 500k) ] ──> [ Cetak Kartu Absen A4 ]
```

#### 1. Registrasi & Login Cepat
* Buka menu login di `/login`. Masukkan nomor WhatsApp dan kata sandi.
* *Tersedia tombol demo cepat: "Masuk sebagai Nasabah Demo" untuk pengujian instan.*

#### 2. Dashboard Nasabah (`/dashboard`)
* **Circular Progress Ring:** Menampilkan persentase kepatuhan menabung dari 50 minggu target.
* **Recent Stamp Strip:** 6 stempel minggu terakhir untuk memantau status setoran berjalan.
* **Proyeksi Kas Bersih:** Kartu kalkulasi transparan yang mengabarkan estimasi uang tunai yang akan diterima saat H-1 Lebaran.

#### 3. Buku Tabungan / Kartu Absensi Fisik Digital (`/tabunganku`)
* **Tampilan Kartu Stempel 50 Minggu:**
  - `LUNAS ✓` (Hijau Emerald): Setoran telah diverifikasi pengurus.
  - `MENUNGGU VERIFIKASI` (Kuning Amber): Bukti transfer sedang ditinjau admin.
  - `BELUM CEK-IN` (Abu-abu Slate): Menunggu pembayaran nasabah.
* **Tampilan Tabel Rekap:** Switcher di kanan atas untuk beralih ke tabel rekapan tanggal jatuh tempo dan nominal.
* **Fitur Cetak Kartu Fisik:**
  - Klik tombol **"Cetak Kartu Absen"** di bagian atas.
  - Browser otomatis membuka pratinjau cetak A4 berlatar putih bersih lengkap dengan kotak stempel, barcode identitas, dan **slot tanda tangan basah Nasabah & Pengurus Tabungan**.

#### 4. Cara Cek-in & Upload Bukti Setoran Mingguan
1. Pada kartu minggu yang bertanda *Cek-in Sekarang*, klik tombol **"Cek-in"**.
2. Modal konfirmasi akan terbuka dengan rincian nomor rekening kas admin (BCA Syariah / BSI / DANA / QRIS).
3. Unggah foto bukti transfer (struk ATM / screenshot mobile banking).
4. Klik **"Kirim Bukti Pembayaran"**. Status berubah menjadi *Menunggu Verifikasi* dan notifikasi toast sukses akan muncul.

#### 5. Pemilihan Katalog Paket Hari Raya (`/paket`)
1. Masuk ke tab **Paket** di navigasi bawah.
2. Telusuri katalog paket sembako atau parcel kue yang tersedia.
3. Klik **"Pilih Paket Ini"**. Sistem otomatis mengaitkan paket dengan buku tabungan Anda dan memotong nilai paket pada formula pembagian H-1 Lebaran.

#### 6. Pengajuan Fasilitas Dana Darurat (`/penarikan`)
* **Ketentuan Keamanan (PRD 4.3):**
  - Bebas biaya admin tambahan (0% penalti).
  - Batas maksimal penarikan: **Rp 500.000**.
  - Batas frekuensi: **Maksimal 1 kali penarikan** per siklus tabungan.
  - Saldo terverifikasi harus mencukupi (Saldo $\ge$ Pengajuan + Biaya Admin).
* **Cara Mengajukan:**
  1. Buka halaman `/penarikan` dan klik **"Ajukan Penarikan Darurat"**.
  2. Masukkan nominal darurat yang dibutuhkan (maksimal Rp 500.000).
  3. Tuliskan alasan kebutuhan darurat (minimal 5 karakter).
  4. Klik **"Kirim Pengajuan"**. Pengurus kas akan meninjau dan mentransfer dana ke rekening nasabah.

#### 7. Profil & Rekening Pencairan H-1 (`/profil`)
* Lengkapi nama lengkap, nomor WhatsApp aktif, alamat domisili, serta rekening bank / e-wallet pencairan (BCA Syariah, BSI, Mandiri, BRI, GoPay, DANA) agar dana bersih di H-1 Idul Fitri dapat langsung ditransfer.

---

### C. Modul Administrator & Pengelola Kas

```
[ Portal Admin /admin ] ──> [ Verifikasi Setoran ] ──> [ Approval Tarik Darurat ]
           │                                                       │
           ▼                                                       ▼
[ Dynamic Master Data ] ─────────────────────────────> [ Manifest Pembagian H-1 & Cetak ]
```

#### 1. Dashboard KPI Operasional (`/admin/dashboard`)
* Memantau metrik kas masuk secara menyeluruh:
  - **Total Kas Terkumpul:** Akumulasi riil seluruh setoran terverifikasi.
  - **Total Nasabah Aktif:** Jumlah penabung yang terdaftar pada siklus berjalan.
  - **Antrean Verifikasi Setoran:** Notifikasi bukti transfer yang butuh tindakan.
  - **Permohonan Tarik Darurat:** Klaim mendesak nasabah yang menunggu persetujuan.

#### 2. Antrean Verifikasi Setoran (`/admin/verifikasi`)
1. Buka menu **Verifikasi Setoran**.
2. Klik thumbnail bukti transfer untuk memperbesar gambar struk pembayaran.
3. Cocokkan nominal transfer dengan nama nasabah.
4. Klik **"Setujui"** untuk mengubah status setoran menjadi `LUNAS` dan menambah saldo nasabah, atau klik **"Tolak"** disertai alasan penolakan jika bukti tidak valid.

#### 3. Persetujuan Klaim Dana Darurat (`/admin/penarikan`)
1. Buka menu **Persetujuan Tarik Darurat**.
2. Sistem secara otomatis memvalidasi apakah saldo tabungan nasabah aman.
3. Lakukan transfer dana darurat ke rekening nasabah yang tertera.
4. Klik tombol **"Cairkan Dana"** dan upload bukti transfer admin untuk menyelesaikan klaim.

#### 4. Manajemen Master Data Dinamis (*Zero Hardcode Policy*) (`/admin/master-data`)
* **Katalog Item Produk:** Tambah/edit nama sembako, satuan (Kg/Liter/Pcs), harga pasar, dan foto.
* **Paket Bundling Lebaran:** Buat kombinasi paket parcel baru beserta penetapan total harga paket.
* **Program Tabungan:** Buat nominal tabungan mingguan baru (cth: Paket 50k, 100k, 200k) dan tentukan biaya admin.

#### 5. Manifest Pembagian Batch H-1 & Export (`/admin/distribusi`)
* **Tabel Rekapitulasi Otomatis:** Sistem merangkum seluruh nasabah, total tabungan, potongan admin, paket barang yang harus diserahkan, potongan penarikan darurat, dan uang kas bersih per orang.
* **Export & Cetak Berita Acara:**
  - Klik **"Unduh Manifest (Excel)"** untuk arsip digital.
  - Klik **"Cetak PDF"** untuk mencetak *Berita Acara Pembagian Tabungan Idul Fitri* lengkap dengan **kolom tanda tangan basah penerima kas/barang** serta otorisasi *Ketua Panitia* & *Bendahara*.

---

## 🏗️ Arsitektur Monorepo & Teknologi

```
nabungid/
├── apps/
│   ├── web/                        # Next.js 15 (App Router) + PWA + Tailwind CSS + Zustand
│   │   ├── app/                    # Routing: Landing, (auth), (nasabah), (admin), offline, 404
│   │   ├── components/             # Reusable UI, 3D Hero, Modals, Install Prompt, Toasts
│   │   ├── stores/                 # Zustand state stores
│   │   └── lib/                    # API client dengan Result Pattern & Guard Clauses
│   │
│   └── api/                        # Express.js REST API + TypeScript
│       ├── prisma/                 # Prisma schema (11 Models) & Database Seeder
│       └── src/
│           ├── config/             # Supabase & PgBouncer database configs
│           ├── controllers/        # Express request controllers
│           ├── services/           # Financial & domain business services
│           ├── middleware/         # JWT Auth RBAC & Global Exception Handlers
│           └── routes/             # REST Endpoints (/api/v1/...)
│
├── packages/
│   ├── shared/                     # DTOs, Enums, Zod validation schemas, & Payout calculation
│   └── tsconfig/                   # Shared TypeScript configurations
│
├── LICENSE                         # MIT License (Ahmad Arif)
├── PRD.md                          # Master Product Requirements Document
└── README.md                       # Comprehensive Project Documentation & User Guide
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat Sistem
* **Node.js:** Versi `>= 18.18.0` atau `>= 20.0.0`
* **npm:** Versi `>= 9.0.0`
* **Git:** Versi terbaru

### 2. Kloning Repository & Instalasi Dependensi
```bash
# Clone repository
git clone https://github.com/AhmadArifff/nabungid.git
cd nabungid

# Beralih ke branch pengembangan (dev)
git checkout dev

# Install seluruh dependensi monorepo
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` pada `apps/api` dan `apps/web`:

```bash
# Backend API (.env)
cp apps/api/.env.example apps/api/.env
```

Pastikan variabel database Supabase pada `apps/api/.env` telah terisi:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres.USER:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.USER:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="nabungid_jwt_secret_super_secure_key_1447h"
JWT_EXPIRES_IN="7d"
SUPABASE_URL="https://ztaasxrrmfrzzplmupjh.supabase.co"
```

### 4. Sinkronisasi Database Prisma & Seeding
```bash
# Generate Prisma Client
npx prisma generate --schema=apps/api/prisma/schema.prisma

# Push skema ke database Supabase
npx prisma db push --schema=apps/api/prisma/schema.prisma

# Jalankan Seeder master data awal
npm run prisma:seed --workspace=@nabungid/api
```

### 5. Menjalankan Server Development
Jalankan frontend dan backend secara bersamaan melalui Turborepo:

```bash
# Menjalankan seluruh aplikasi (Web port 3000 + API port 5000)
npm run dev
```

* **Frontend Web (PWA):** [http://localhost:3000](http://localhost:3000)
* **Backend REST API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
* **Health Check API:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🗄️ Struktur Database Supabase Prisma

Sistem menggunakan 11 model relasional yang telah diindeks untuk performa tinggi:

| Nama Model | Fungsi & Deskripsi |
| :--- | :--- |
| **`User`** | Akun pengguna terotentikasi dengan role `ADMIN` atau `NASABAH`. |
| **`SavingsCycle`** | Siklus 1 tahun (Tahun Hijriah 1447 H, rentang tanggal 50 minggu). |
| **`SavingsProgram`** | Master program tabungan (nominal mingguan Rp 100k, biaya admin Rp 25k). |
| **`ProductCategory`** | Kategori dinamis barang (*Sembako*, *Kue Kaleng*, *Perabotan*). |
| **`ProductItem`** | Item produk individual (daging sapi, minyak, toples, wajan). |
| **`PackageBundle`** | Bundling paket barang Lebaran beserta penetapan harga paket. |
| **`PackageBundleItem`** | Relasi many-to-many item produk di dalam bundling. |
| **`MemberSaving`** | Data kepesertaan aktif nasabah pada siklus tabungan berjalan. |
| **`WeeklyLedger`** | 50 catatan baris setoran mingguan, status verifikasi, dan bukti transfer. |
| **`EmergencyWithdrawal`** | Pengajuan penarikan darurat nasabah (Maks Rp 500k, 1x limit guard). |
| **`DistributionPayout`** | Rekapitulasi formula pembagian bersih dan berita acara penyerahan H-1. |
| **`AdminAuditLog`** | Rekam jejak audit aktivitas administrator terhadap data finansial. |

---

## 📄 Lisensi & Hak Cipta

Proyek ini dilisensikan di bawah lisensi **MIT License** — dikembangkan dan dipelihara secara resmi oleh **[Ahmad Arif](https://github.com/AhmadArifff)**.

```
MIT License

Copyright (c) 2026 Ahmad Arif

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

Dibuat dengan ❤️ untuk Mempermudah Ibadah & Perayaan Idul Fitri Umat Muslim Indonesia.

**NabungID — Menabung Disiplin, Lebaran Berkah & Tenang.**

</div>
