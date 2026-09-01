# 🚀 Panduan & Nilai Environment Variables Vercel (NabungID)

Dokumen ini berisi seluruh konfigurasi **Environment Variables** resmi yang siap di-copy-paste langsung ke form **Environment Variables** di dashboard Vercel saat proses deployment.

---

## 📋 1. Format Salin Cepat (Vercel Bulk Paste Format)

> [!TIP]
> Di Vercel Dashboard, Anda dapat langsung mengklik tombol **"Paste .env"** atau menekan `Ctrl + V` pada kolom Environment Variables untuk memasukkan seluruh variabel ini sekaligus dalam 1 detik:

```env
DATABASE_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=nabungid_secure_jwt_secret_key_1447h_2026m
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://ztaasxrrmfrzzplmupjh.supabase.co
NEXT_PUBLIC_APP_URL=https://nabungid.vercel.app
```

---

## 📊 2. Tabel Rincian Variabel Satuan (Input Satu per Satu)

Jika Anda ingin memasukkan variabel satu per satu di form Vercel:

| No | Key / Nama Variabel | Value / Nilai Resmi | Environment Target |
| :---: | :--- | :--- | :---: |
| 1 | `DATABASE_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development |
| 2 | `DIRECT_URL` | `postgresql://postgres.ztaasxrrmfrzzplmupjh:GHk6Npb6HahgsWH4@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Production, Preview, Development |
| 3 | `JWT_SECRET` | `nabungid_secure_jwt_secret_key_1447h_2026m` | Production, Preview, Development |
| 4 | `JWT_EXPIRES_IN` | `7d` | Production, Preview, Development |
| 5 | `SUPABASE_URL` | `https://ztaasxrrmfrzzplmupjh.supabase.co` | Production, Preview, Development |
| 6 | `NEXT_PUBLIC_APP_URL` | `https://nabungid.vercel.app` *(atau domain kustom Anda)* | Production, Preview, Development |

---

## 🛠️ 3. Pengaturan Project di Vercel (Project Settings)

Pastikan konfigurasi di layar **"Configure Project"** Vercel diatur sebagai berikut:

- **Repository:** `AhmadArifff/nabungid`
- **Branch:** `dev` *(atau `main`)*
- **Framework Preset:** `Next.js`
- **Root Directory:** `apps/web` *(Penting: Ubah root directory ke `apps/web` jika diminta, atau biarkan `vercel.json` di root mengaturnya)*
- **Build Command:** `npx turbo run build --filter=@nabungid/web...`
- **Output Directory:** `.next`
- **Node.js Version:** `20.x` *(Default Vercel)*

---

## 🔑 4. Akun Login Bawaan untuk Uji Coba Setelah Deploy:

Setelah website berhasil tayang di Vercel:

### 👤 Akun Pengurus / Admin:
- **No. WhatsApp / Email:** `089988776655` / `admin@nabungid.com`
- **Password:** `Admin123!`
- **Akses Halaman:** `/admin/dashboard` & `/admin/absensi`

### 👤 Akun Nasabah Demo:
- **No. WhatsApp / Email:** `081234567890` / `ahmad@example.com`
- **Password:** `Nasabah123!`
- **Akses Halaman:** `/dashboard` & `/tabunganku`
