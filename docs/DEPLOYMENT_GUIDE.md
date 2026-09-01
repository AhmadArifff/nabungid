# NabungID — Production Deployment & Go-Live Operations Guide

**Product:** NabungID (Aplikasi Tabungan Hari Raya & Paket Lebaran Berkelanjutan)  
**Version:** v1.2.0 (Production-Ready)  
**Prepared by:** Lead Product Manager & DevOps Squad (`/pm`, `/backend`)  

---

## 1. Architecture Overview

NabungID mengadopsi arsitektur decoupled monorepo:
1. **Frontend (`apps/web`):** Next.js 14/15 App Router + Tailwind CSS + PWA (Deploy ke **Vercel** / **Netlify** / **Cloudflare Pages**).
2. **Backend API (`apps/api`):** Express.js REST API + Prisma ORM + Winston (Deploy ke **Railway** / **Render** / **Docker VPS**).
3. **Database:** Supabase PostgreSQL Cloud dengan PgBouncer Connection Pooler di AWS Mumbai (`ap-south-1`).
4. **Shared Package (`packages/shared`):** Single source of truth untuk Zod schema, types, dan formula finansial.

---

## 2. Environment Variables Checklist

### 2.1 Backend API (`apps/api/.env`)
| Variable | Value Production Example | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port listen server Express |
| `NODE_ENV` | `production` | Mode environment Node.js |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase Pooler Port 6543 |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Supabase Direct Session Port 5432 |
| `JWT_SECRET` | *(64-char random hex string)* | Kunci enkripsi token login |
| `JWT_EXPIRES_IN`| `7d` | Masa berlaku token |
| `SUPABASE_URL` | `https://[REF].supabase.co` | Endpoint Supabase Storage |

### 2.2 Frontend (`apps/web/.env.production`)
| Variable | Value Production | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://api.nabungid.com/api/v1` | URL Backend API Production |

---

## 3. Deployment Steps

### 3.1 Deploying Frontend to Vercel
1. Hubungkan repository GitHub `https://github.com/AhmadArifff/nabungid` ke Vercel.
2. Root Directory: `apps/web` (atau biarkan `vercel.json` di root workspace mengaturnya).
3. Build Command: `cd ../.. && npx turbo run build --filter=@nabungid/web...`
4. Output Directory: `.next`
5. Atur Environment Variable: `NEXT_PUBLIC_API_URL`.

### 3.2 Deploying Backend API to Docker / Railway / VPS
1. Jalankan build container:
   ```bash
   docker build -t nabungid-api -f apps/api/Dockerfile .
   ```
2. Jalankan container:
   ```bash
   docker run -d -p 5000:5000 --env-file apps/api/.env --name nabungid-api nabungid-api
   ```
3. Health check verifikasi:
   ```bash
   curl https://api.nabungid.com/health
   ```

---

## 4. Post-Deployment Database Verification
Setelah deploy backend, jalankan migrasi sekali dari CI/CD atau terminal:
```bash
npx prisma db push --schema=apps/api/prisma/schema.prisma
```

Sistem NabungID kini 100% siap melayani nasabah dan pengurus secara stabil, aman, dan transparan! 🚀
