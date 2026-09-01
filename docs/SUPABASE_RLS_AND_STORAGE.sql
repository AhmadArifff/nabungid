-- =============================================================================
-- NabungID — Supabase Row Level Security (RLS) & Storage Setup Script
-- =============================================================================

-- 1. Enable Row Level Security (RLS) on all 12 public tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavingsCycle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavingsProgram" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageBundle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageBundleItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MemberSaving" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeeklyLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmergencyWithdrawal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DistributionPayout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminAuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Access Policies on Public Tables
DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "User";
CREATE POLICY "Enable full access for backend and service_role" ON "User" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "SavingsCycle";
CREATE POLICY "Enable full access for backend and service_role" ON "SavingsCycle" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "SavingsProgram";
CREATE POLICY "Enable full access for backend and service_role" ON "SavingsProgram" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "ProductCategory";
CREATE POLICY "Enable full access for backend and service_role" ON "ProductCategory" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "ProductItem";
CREATE POLICY "Enable full access for backend and service_role" ON "ProductItem" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "PackageBundle";
CREATE POLICY "Enable full access for backend and service_role" ON "PackageBundle" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "PackageBundleItem";
CREATE POLICY "Enable full access for backend and service_role" ON "PackageBundleItem" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "MemberSaving";
CREATE POLICY "Enable full access for backend and service_role" ON "MemberSaving" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "WeeklyLedger";
CREATE POLICY "Enable full access for backend and service_role" ON "WeeklyLedger" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "EmergencyWithdrawal";
CREATE POLICY "Enable full access for backend and service_role" ON "EmergencyWithdrawal" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "DistributionPayout";
CREATE POLICY "Enable full access for backend and service_role" ON "DistributionPayout" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "AdminAuditLog";
CREATE POLICY "Enable full access for backend and service_role" ON "AdminAuditLog" FOR ALL USING (true) WITH CHECK (true);

-- 3. Create Storage Buckets for NabungID Images & Assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('payment-proofs', 'payment-proofs', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('receipts', 'receipts', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Storage Policies on storage.objects for Public Read & Upload Access
DROP POLICY IF EXISTS "NabungID Public Select" ON storage.objects;
CREATE POLICY "NabungID Public Select" ON storage.objects
FOR SELECT USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));

DROP POLICY IF EXISTS "NabungID Public Insert" ON storage.objects;
CREATE POLICY "NabungID Public Insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));

DROP POLICY IF EXISTS "NabungID Public Update" ON storage.objects;
CREATE POLICY "NabungID Public Update" ON storage.objects
FOR UPDATE USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));

DROP POLICY IF EXISTS "NabungID Public Delete" ON storage.objects;
CREATE POLICY "NabungID Public Delete" ON storage.objects
FOR DELETE USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));
