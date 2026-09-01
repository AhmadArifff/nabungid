# NabungID — Panduan Deployment Produksi 100% Vercel

**Product:** NabungID (Aplikasi Tabungan Hari Raya & Paket Lebaran Berkelanjutan)  
**Deployment Platform:** 100% Vercel Cloud Platform (Zero Docker / Pure Serverless)  
**Version:** v1.2.0 (Production-Ready)  
**Prepared by:** Lead Product Manager & DevOps Squad (`/pm`, `/frontend`, `/backend`)  

---

## 1. Arsitektur Deployment Vercel (All-in-One)

Seluruh ekosistem platform NabungID dideploy secara terpusat pada **Vercel** tanpa memerlukan container Docker atau server VPS:

```
[ Pengguna / Nasabah / Admin ]
              │
              ▼
    [ Vercel Edge Network ]
    ├── Frontend Next.js 14/15 (PWA + SSR + Tailwind UI)
    ├── Vercel Serverless Functions & API Routing
    └── Asset Optimizations (Three.js 3D Canvas & Images)
              │
              ▼
  [ Supabase Cloud PostgreSQL ] (Port 6543 Pooler Mode)
```

---

## 2. Pengaturan Variabel Lingkungan di Vercel Dashboard

Saat menghubungkan repository GitHub ke Vercel, cukup masukkan Environment Variables berikut di menu **Project Settings ➔ Environment Variables**:

| Variable Key | Nilai / Format | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Koneksi database Supabase Pooler Port 6543 |
| `DIRECT_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Koneksi direct Supabase untuk migrasi |
| `JWT_SECRET` | `nabungid_secure_jwt_secret_key_1447h_2026m` | Kunci enkripsi token login |
| `NEXT_PUBLIC_APP_URL` | `https://nabungid.vercel.app` *(sesuaikan domain)* | URL resmi aplikasi |

---

## 3. Langkah-Langkah Deploy ke Vercel (One-Click)

1. Buka [https://vercel.com/new](https://vercel.com/new).
2. Pilih repository GitHub: **`AhmadArifff/nabungid`** (Branch: **`dev`** atau **`main`**).
3. **Konfigurasi Project:**
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && npx turbo run build --filter=@nabungid/web...`
   - **Output Directory:** `.next`
4. Masukkan **Environment Variables** dari tabel di atas.
5. Klik **"Deploy"** 🚀.
6. Aplikasi langsung online dengan SSL HTTPS otomatis dan CDN global!

---

## 4. Keunggulan Deployment 100% Vercel
- ⚡ **Zero Maintenance Server:** Tidak perlu mengelola OS, Docker daemon, atau maintenance server fisik.
- 🔒 **Keamanan Terjamin:** Sertifikat SSL/TLS HTTPS otomatis terbit dan terbarui.
- 📈 **Auto Scaling:** Otomatis menangani lonjakan ribuan nasabah saat musim mendekati Idul Fitri.
- 📱 **PWA Ready:** Caching service worker dan offline manifest aktif di seluruh dunia.
