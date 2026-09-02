# 🚀 Panduan Environment Variables 2 Project Vercel (Monorepo NabungID)

Dalam arsitektur Monorepo Turborepo, Vercel secara cerdas memisahkan aplikasi menjadi **2 Project Deployment Terpisah**:
1. ⚙️ **Project 1: Backend API (`apps/api`)** — Serverless REST API Express & Prisma ORM.
2. 🎨 **Project 2: Frontend Web (`apps/web`)** — Next.js 14 App Router, PWA, dan UI Dashboard.

Masing-masing project memiliki form **Environment Variables** tersendiri di Vercel Dashboard.

---

## ⚙️ PROJECT 1: BACKEND API (`apps/api`)

Saat mengimpor project Backend di Vercel dengan **Root Directory: `apps/api`**:

### 📋 Salin Cepat `.env` Backend (Tinggal Paste di Form Vercel Backend):

```env
DATABASE_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=nabungid_secure_jwt_secret_key_1447h_2026m
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://ztaasxrrmfrzzplmupjh.supabase.co
CORS_ORIGIN=*
```

### 📊 Tabel Rincian Variabel Backend (`apps/api`):

| Key Variabel | Nilai Resmi | Kegunaan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Koneksi database Supabase Pooler Port 6543 |
| `DIRECT_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Koneksi direct Supabase untuk Prisma migration |
| `JWT_SECRET` | `nabungid_secure_jwt_secret_key_1447h_2026m` | Kunci enkripsi token login JWT |
| `JWT_EXPIRES_IN`| `7d` | Masa aktif token login (7 hari) |
| `SUPABASE_URL` | `https://ztaasxrrmfrzzplmupjh.supabase.co` | URL instance Supabase Storage & Database |
| `CORS_ORIGIN`  | `*` *(atau domain frontend Anda)* | Mengizinkan request dari frontend |

---

## 🎨 PROJECT 2: FRONTEND WEB (`apps/web`)

Saat mengimpor project Frontend di Vercel dengan **Root Directory: `apps/web`**:

### 📋 Salin Cepat `.env` Frontend (Tinggal Paste di Form Vercel Frontend):

> [!TIP]
> Ganti `https://nabungid-api.vercel.app` dengan URL domain resmi backend yang didapatkan setelah Project 1 Backend selesai dideploy!

```env
NEXT_PUBLIC_API_URL=https://nabungid-api.vercel.app/api/v1
NEXT_PUBLIC_APP_URL=https://nabungid.vercel.app
DATABASE_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=nabungid_secure_jwt_secret_key_1447h_2026m
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://ztaasxrrmfrzzplmupjh.supabase.co
```

### 📊 Tabel Rincian Variabel Frontend (`apps/web`):

| Key Variabel | Nilai Resmi | Kegunaan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://nabungid-api.vercel.app/api/v1` *(sesuaikan nama project api Anda di Vercel)* | **Alamat API Backend** agar Frontend Next.js terhubung ke Backend |
| `NEXT_PUBLIC_APP_URL` | `https://nabungid.vercel.app` | URL domain publik website Frontend |
| `DATABASE_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Akses langsung database Supabase |
| `DIRECT_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Koneksi direct Supabase |
| `JWT_SECRET` | `nabungid_secure_jwt_secret_key_1447h_2026m` | Validasi token session client |
| `SUPABASE_URL` | `https://ztaasxrrmfrzzplmupjh.supabase.co` | Akses file storage bukti bayar |

---

## 🚀 Urutan Deploy yang Disarankan di Vercel:

1. **Deploy Backend Dulu (`apps/api`):**
   - Import repository `AhmadArifff/nabungid`, pilih Root Directory: `apps/api`.
   - Paste **`.env` Backend** di atas ➔ Klik **Deploy**.
   - Catat URL hasil deploy backend (misal: `https://nabungid-api.vercel.app`).
2. **Deploy Frontend (`apps/web`):**
   - Import repository `AhmadArifff/nabungid`, pilih Root Directory: `apps/web`.
   - Paste **`.env` Frontend** di atas (pastikan `NEXT_PUBLIC_API_URL` diisi URL backend dari langkah 1) ➔ Klik **Deploy**.
3. **Selesai!** Frontend dan Backend Anda kini terhubung dan online secara otomatis 24/7 di Vercel! 🎉
