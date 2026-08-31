# NabungID — Platform Tabungan Hari Raya & Paket Lebaran Terintegrasi

[![Architecture](https://img.shields.io/badge/Architecture-Turborepo%20Monorepo-blue)](https://turbo.build/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%2F15%20%7C%20PWA%20%7C%20TailwindCSS-emerald)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Express.js%20%7C%20Prisma%20%7C%20PostgreSQL-indigo)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-teal)](https://supabase.com/)

**NabungID** adalah aplikasi monorepo modern untuk memfasilitasi program tabungan berkala (mingguan) menuju Hari Raya Idul Fitri selama 1 tahun penuh. Program tabungan dimulai secara otomatis pada **H+1 minggu setelah Idul Fitri** dan dicairkan pada **H-1 minggu sebelum Idul Fitri tahun berikutnya** (~48 hingga 50 minggu).

---

## 🌟 Fitur Utama

- **Siklus Tabungan Fleksibel:** Siklus 1 tahun (H+1 Lebaran s.d. H-1 Lebaran) dengan nominal mingguan dinamis (Rp 25k, Rp 50k, Rp 100k, Rp 200k, atau custom).
- **Katalog Master Data Paket Barang Dinamis (*Zero Hardcode*):** Paket Sembako mentah (daging, minyak, telur, beras), snack/kue kaleng Lebaran, dan perabotan rumah tangga yang dikonfigurasi via Admin Panel.
- **Formula Distribusi Transparan:**
  $$\text{Dana Bersih Diterima} = \text{Total Tabungan} - \text{Biaya Admin} - \text{Total Nilai Paket Barang} - \text{Total Penarikan Darurat}$$
- **Fitur Penarikan Darurat (Emergency Withdrawal):** Penarikan tanpa komisi/penalti dengan batas maksimal Rp 500.000 (1x penarikan per siklus).
- **Dual Role Management (RBAC):** Role **Admin** (Pengelola Kas & Master Data) dan Role **Nasabah** (Buku Tabungan Digital & Simulasi).
- **High-Conversion Landing Page:** Desain UI/UX Pro Max Glassmorphism dengan kalkulator tabungan interaktif.

---

## 📁 Struktur Monorepo (Turborepo)

```
nabungid/
├── apps/
│   ├── web/           # Next.js (App Router) + PWA + Tailwind CSS + Zustand
│   └── api/           # Express.js + TypeScript + Prisma ORM
├── packages/
│   ├── shared/        # Shared Zod schemas, DTOs, & calculation engines
│   ├── tsconfig/      # Shared TypeScript configuration
│   └── eslint-config/ # Shared ESLint rules
├── PRD.md             # Master Product Requirements Document
└── README.md
```

---

## 📖 Dokumentasi Lengkap

Dokumentasi lengkap mengenai spesifikasi fungsional, arsitektur sistem, skema database Prisma, REST API contracts, dan strategi QA dapat dilihat pada berkas **[PRD.md](./PRD.md)**.

---

## 🌿 Git Branching Strategy

- `main` : Production-ready branch.
- `dev`  : Active development branch untuk fitur dan integrasi harian.
