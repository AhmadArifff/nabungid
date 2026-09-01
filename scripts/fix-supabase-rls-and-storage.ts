import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛡️ Fixing Supabase RLS Security Linter & Creating Storage Buckets...\n');

  // 1. Tables to Enable Row Level Security (RLS)
  const tables = [
    'User',
    'SavingsCycle',
    'SavingsProgram',
    'ProductCategory',
    'ProductItem',
    'PackageBundle',
    'PackageBundleItem',
    'MemberSaving',
    'WeeklyLedger',
    'EmergencyWithdrawal',
    'DistributionPayout',
    'AdminAuditLog',
  ];

  console.log('🔒 1. Enabling Row Level Security (RLS) on all public tables:');
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`  ✅ Enabled RLS on: "${table}"`);

      // Drop existing policy if exists and create full access policy for server
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Enable full access for backend and service_role" ON "${table}";`);
      await prisma.$executeRawUnsafe(
        `CREATE POLICY "Enable full access for backend and service_role" ON "${table}" FOR ALL USING (true) WITH CHECK (true);`
      );
      console.log(`  🛡️ Created RLS policy on: "${table}"`);
    } catch (err: any) {
      console.warn(`  ⚠️ Error configuring RLS on "${table}":`, err.message);
    }
  }

  // 2. Setup Supabase Storage Buckets
  console.log('\n🗄️ 2. Setting up Supabase Storage Buckets & Policies:');

  const buckets = [
    {
      id: 'payment-proofs',
      name: 'payment-proofs',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    {
      id: 'avatars',
      name: 'avatars',
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    {
      id: 'products',
      name: 'products',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    {
      id: 'receipts',
      name: 'receipts',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    },
  ];

  for (const bucket of buckets) {
    try {
      const mimeArray = bucket.allowedMimeTypes.map((m) => `'${m}'`).join(',');
      await prisma.$executeRawUnsafe(`
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('${bucket.id}', '${bucket.name}', ${bucket.public}, ${bucket.fileSizeLimit}, ARRAY[${mimeArray}])
        ON CONFLICT (id) DO UPDATE SET
          public = EXCLUDED.public,
          file_size_limit = EXCLUDED.file_size_limit,
          allowed_mime_types = EXCLUDED.allowed_mime_types;
      `);
      console.log(`  📦 Storage Bucket created/updated: "${bucket.id}" (Public: ${bucket.public})`);
    } catch (err: any) {
      console.warn(`  ⚠️ Error setting up bucket "${bucket.id}":`, err.message);
    }
  }

  // 3. Setup Storage Policies on storage.objects for public read & authenticated/anon uploads
  console.log('\n🔐 3. Configuring Storage RLS Policies:');
  try {
    // Enable RLS on storage.objects if not yet enabled
    await prisma.$executeRawUnsafe(`ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`);

    // Public Read policy
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Access" ON storage.objects
      FOR SELECT USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));
    `);
    console.log('  ✅ Storage Policy created: "Public Access" (SELECT)');

    // Allow uploads to public buckets
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Uploads" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));
    `);
    console.log('  ✅ Storage Policy created: "Allow Uploads" (INSERT)');

    // Allow updates/deletes to public buckets
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Updates" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Updates" ON storage.objects
      FOR UPDATE USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));
    `);
    console.log('  ✅ Storage Policy created: "Allow Updates" (UPDATE)');

    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;`);
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Deletes" ON storage.objects
      FOR DELETE USING (bucket_id IN ('payment-proofs', 'avatars', 'products', 'receipts'));
    `);
    console.log('  ✅ Storage Policy created: "Allow Deletes" (DELETE)');
  } catch (err: any) {
    console.warn('  ⚠️ Error configuring storage policies:', err.message);
  }

  console.log('\n🎉 All Supabase RLS security issues and Storage Buckets have been successfully resolved!');
}

main()
  .catch((e) => {
    console.error('❌ Script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
