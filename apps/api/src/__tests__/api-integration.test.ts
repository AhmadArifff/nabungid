import request from 'supertest';
import { app } from '../app';
import { prisma } from '../config/prisma.config';

async function runApiIntegrationTests() {
  console.log('🧪 Starting NabungID API Integration & Security IDOR Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('🏥 1. Testing Health Check & System Status');
    const healthRes = await request(app).get('/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'ok', 'Health Check Endpoint (GET /health)');

    // 2. Auth: Login Nasabah Demo
    console.log('\n🔐 2. Testing Authentication & JWT Flow');
    const nasabahLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: '081234567890',
        password: 'Nasabah123!',
      });
    assert(
      nasabahLoginRes.status === 200 && nasabahLoginRes.body.data?.token,
      'Nasabah Login Success & JWT Token Issued'
    );
    const nasabahToken = nasabahLoginRes.body.data?.token;

    // 3. Auth: Login Admin
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: '089988776655',
        password: 'Admin123!',
      });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.body.data?.token,
      'Admin Login Success & JWT Token Issued'
    );
    const adminToken = adminLoginRes.body.data?.token;

    // 4. Auth: Invalid Password Rejection
    const invalidLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: '081234567890',
        password: 'WrongPassword!',
      });
    assert(invalidLoginRes.status === 401, 'Invalid Password Rejection (401 Unauthorized)');

    // 5. Nasabah: Get My Savings
    console.log('\n📱 3. Testing Nasabah Portal Endpoints');
    const savingsRes = await request(app)
      .get('/api/v1/nasabah/savings')
      .set('Authorization', `Bearer ${nasabahToken}`);
    assert(savingsRes.status === 200 && savingsRes.body.data?.id, 'Nasabah Active Savings Program Retrieved');
    const memberSavingId = savingsRes.body.data?.id;

    // 6. Admin: Dashboard Summary KPI
    console.log('\n🛡️ 4. Testing Admin Console Endpoints');
    const summaryRes = await request(app)
      .get('/api/v1/admin/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(
      summaryRes.status === 200 && typeof summaryRes.body.data?.totalKas === 'number',
      'Admin KPI Summary Retrieved (Total Kas, Nasabah Count)'
    );

    // 7. Admin: 50-Week Attendance Matrix (Optimized 1-Query)
    const matrixRes = await request(app)
      .get('/api/v1/admin/ledgers/matrix')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(
      matrixRes.status === 200 && Array.isArray(matrixRes.body.data) && matrixRes.body.data.length > 0,
      'Admin 50-Week Attendance Matrix Retrieved (GET /api/v1/admin/ledgers/matrix)'
    );

    // 8. Admin: 1-Click Quick Cash Entry & Dynamic Toggle Uncheck
    if (memberSavingId) {
      const quickCashRes = await request(app)
        .post('/api/v1/admin/ledgers/quick-cash')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberSavingId,
          weekNumber: 1,
        });
      assert(
        quickCashRes.status === 200 && quickCashRes.body.data?.status === 'VERIFIED',
        'Admin Quick Cash Entry Verified (POST /api/v1/admin/ledgers/quick-cash)'
      );

      // 8b. Admin: Toggle Uncheck / Revert to Pending Payment (Mistake Handling)
      const revertRes = await request(app)
        .post('/api/v1/admin/ledgers/toggle-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberSavingId,
          weekNumber: 1,
          targetStatus: 'PENDING_PAYMENT',
        });
      assert(
        revertRes.status === 200 && revertRes.body.data?.status === 'PENDING_PAYMENT',
        'Admin Revert / Uncheck Entry to Pending Payment (POST /api/v1/admin/ledgers/toggle-status)'
      );

      // 8c. Re-check back to Verified
      const recheckRes = await request(app)
        .post('/api/v1/admin/ledgers/toggle-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberSavingId,
          weekNumber: 1,
          targetStatus: 'VERIFIED',
        });
      assert(
        recheckRes.status === 200 && recheckRes.body.data?.status === 'VERIFIED',
        'Admin Re-check Status back to Verified (POST /api/v1/admin/ledgers/toggle-status)'
      );

      // 9. Admin: Trigger WhatsApp Reminder
      const reminderRes = await request(app)
        .post('/api/v1/admin/broadcast/whatsapp-reminder')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          memberSavingId,
          weekNumber: 2,
        });
      assert(
        reminderRes.status === 200 && reminderRes.body.data?.waUrl.includes('https://wa.me/'),
        'Admin WhatsApp Broadcast Reminder Generated (POST /api/v1/admin/broadcast/whatsapp-reminder)'
      );
    }

    // 10. Admin: Batch Distribution Calculation H-1
    const batchRes = await request(app)
      .get('/api/v1/admin/distribution/calculate-batch')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(
      batchRes.status === 200 && Array.isArray(batchRes.body.data),
      'Admin Batch Payout Calculation for H-1 Idul Fitri'
    );

    // 11. Security & RBAC / IDOR Protection (TC-IDOR-01)
    console.log('\n🔒 5. Testing Security, RBAC & IDOR Protections');
    const unauthorizedAdminAccess = await request(app)
      .get('/api/v1/admin/ledgers/matrix')
      .set('Authorization', `Bearer ${nasabahToken}`);
    assert(
      unauthorizedAdminAccess.status === 403,
      'TC-IDOR-01: Nasabah access to Admin route is blocked (403 Forbidden)'
    );

    const noTokenAccess = await request(app).get('/api/v1/nasabah/savings');
    assert(
      noTokenAccess.status === 401,
      'Unauthenticated request blocked (401 Unauthorized)'
    );

    console.log(`\n🏁 API Integration Test Summary: ${passed} Passed, ${failed} Failed\n`);
  } catch (error) {
    console.error('Fatal test error:', error);
    failed++;
  } finally {
    await prisma.$disconnect();
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runApiIntegrationTests();
