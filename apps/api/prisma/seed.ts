import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial dynamic master data for NabungID...');

  // 1. Seed Users (Admin & Demo Nasabah)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin123!', salt);
  const nasabahPasswordHash = await bcrypt.hash('Nasabah123!', salt);

  const admin = await prisma.user.upsert({
    where: { phoneNumber: '089988776655' },
    update: {},
    create: {
      name: 'Admin Pengelola',
      email: 'admin@nabungid.com',
      phoneNumber: '089988776655',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      address: 'Kantor Pusat NabungID, Jakarta Selatan',
    },
  });

  const nasabah = await prisma.user.upsert({
    where: { phoneNumber: '081234567890' },
    update: {},
    create: {
      name: 'Ahmad Arif',
      email: 'ahmad@example.com',
      phoneNumber: '081234567890',
      passwordHash: nasabahPasswordHash,
      role: 'NASABAH',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      bankName: 'BCA Syariah',
      accountNumber: '9876543210',
      accountHolder: 'Ahmad Arif',
    },
  });

  console.log(`✅ Users seeded: Admin (${admin.email}), Nasabah (${nasabah.email})`);

  // 2. Seed Savings Cycle 1447 H
  const startDate = new Date('2025-04-07T00:00:00.000Z'); // H+1 Idul Fitri 1446H
  const endDate = new Date('2026-03-15T00:00:00.000Z'); // H-1 Idul Fitri 1447H

  let cycle = await prisma.savingsCycle.findFirst({
    where: { hijriYear: '1447 H' },
  });

  if (!cycle) {
    cycle = await prisma.savingsCycle.create({
      data: {
        name: 'Tabungan Idul Fitri 1447 H / 2026 M',
        hijriYear: '1447 H',
        startDate,
        endDate,
        totalWeeks: 50,
        isActive: true,
      },
    });
  }

  console.log(`✅ Savings Cycle seeded: ${cycle.name}`);

  // 3. Seed Savings Program (100k)
  let program = await prisma.savingsProgram.findFirst({
    where: { cycleId: cycle.id, weeklyNominal: 100000 },
  });

  if (!program) {
    program = await prisma.savingsProgram.create({
      data: {
        cycleId: cycle.id,
        name: 'Paket Berkah 100K Mingguan',
        weeklyNominal: 100000,
        targetWeeks: 50,
        adminFee: 25000,
        description: 'Setoran Rp 100.000 per minggu selama 50 minggu. Total tabungan Rp 5.000.000.',
        isActive: true,
      },
    });
  }

  console.log(`✅ Savings Program seeded: ${program.name}`);

  // 4. Seed Product Categories
  const catSembako = await prisma.productCategory.upsert({
    where: { slug: 'sembako' },
    update: {},
    create: {
      name: 'Sembako & Daging',
      slug: 'sembako',
      description: 'Kebutuhan pokok dapur Hari Raya seperti daging sapi, minyak, beras, telur.',
      icon: 'ShoppingBag',
    },
  });

  const catKue = await prisma.productCategory.upsert({
    where: { slug: 'kue-kaleng' },
    update: {},
    create: {
      name: 'Kue & Snack Kaleng',
      slug: 'kue-kaleng',
      description: 'Biskuit dan kue kaleng premium untuk suguhan tamu Idul Fitri.',
      icon: 'Cookie',
    },
  });

  const catPerabotan = await prisma.productCategory.upsert({
    where: { slug: 'perabotan' },
    update: {},
    create: {
      name: 'Perabotan Dapur',
      slug: 'perabotan',
      description: 'Peralatan masak dan wadah toples elegan menyambut Lebaran.',
      icon: 'Utensils',
    },
  });

  console.log('✅ Product categories seeded.');

  // 5. Seed Product Items
  const itemDaging = await prisma.productItem.create({
    data: {
      categoryId: catSembako.id,
      name: 'Daging Sapi Segar 1 Kg',
      unit: 'Kg',
      estimatedPrice: 140000,
      description: 'Daging sapi kualitas super segar untuk rendang Lebaran.',
    },
  });

  const itemMinyak = await prisma.productItem.create({
    data: {
      categoryId: catSembako.id,
      name: 'Minyak Goreng Pouch 2 Liter',
      unit: 'Pouch',
      estimatedPrice: 38000,
      description: 'Minyak goreng kelapa sawit jernih kualitas terbaik.',
    },
  });

  const itemTelur = await prisma.productItem.create({
    data: {
      categoryId: catSembako.id,
      name: 'Telur Ayam Negeri 1 Kg',
      unit: 'Kg',
      estimatedPrice: 30000,
      description: 'Telur ayam negeri segar pilihan.',
    },
  });

  const itemKhongGuan = await prisma.productItem.create({
    data: {
      categoryId: catKue.id,
      name: 'Biskuit Khong Guan Classic 1600g',
      unit: 'Kaleng',
      estimatedPrice: 110000,
      description: 'Biskuit legendaris aneka rasa untuk meja tamu Lebaran.',
    },
  });

  const itemWajan = await prisma.productItem.create({
    data: {
      categoryId: catPerabotan.id,
      name: 'Wajan Granit Anti Lengket 28cm',
      unit: 'Pcs',
      estimatedPrice: 220000,
      description: 'Wajan premium anti gores dan anti lengket dengan tutup kaca.',
    },
  });

  console.log('✅ Product items seeded.');

  // 6. Seed Package Bundles
  await prisma.packageBundle.upsert({
    where: { slug: 'paket-sembako-lengkap' },
    update: {},
    create: {
      name: 'Paket Sembako Lengkap',
      slug: 'paket-sembako-lengkap',
      bundlePrice: 350000,
      description: 'Paket sembako komplit: Daging sapi 1kg, minyak 2L, beras 5kg, dan telur 1kg.',
      items: {
        create: [
          { itemId: itemDaging.id, quantity: 1 },
          { itemId: itemMinyak.id, quantity: 2 },
          { itemId: itemTelur.id, quantity: 1 },
        ],
      },
    },
  });

  await prisma.packageBundle.upsert({
    where: { slug: 'paket-kue-snack' },
    update: {},
    create: {
      name: 'Paket Kue & Snack Lebaran',
      slug: 'paket-kue-snack',
      bundlePrice: 250000,
      description: 'Aneka biskuit kaleng legendaris dan sirup manis suguhan keluarga.',
      items: {
        create: [{ itemId: itemKhongGuan.id, quantity: 2 }],
      },
    },
  });

  await prisma.packageBundle.upsert({
    where: { slug: 'paket-perabotan-dapur' },
    update: {},
    create: {
      name: 'Paket Perabotan Dapur Impian',
      slug: 'paket-perabotan-dapur',
      bundlePrice: 400000,
      description: 'Wajan granit anti lengket 28cm dan set toples kedap udara 6 pcs.',
      items: {
        create: [{ itemId: itemWajan.id, quantity: 1 }],
      },
    },
  });

  console.log('✅ Package bundles seeded successfully.');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
