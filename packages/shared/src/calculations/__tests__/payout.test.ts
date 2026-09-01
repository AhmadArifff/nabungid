import { calculateEndCyclePayout, validateEmergencyWithdrawal } from '../payout';

// Simple self-contained test runner that runs with ts-node / node / vitest
function runTests() {
  console.log('🧪 Running NabungID Financial Calculation & Emergency Guard Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- 1. FINANCIAL DISTRIBUTION TESTS (TC-FIN) ---
  console.log('📊 1. Testing End-of-Cycle Payout Calculations (TC-FIN)');

  // TC-FIN-01: Normal Payout (50 weeks x 100k = 5jt, Admin 25k, Bundle 318k, Emergency 0)
  const res1 = calculateEndCyclePayout({
    totalSavedAmount: 5000000,
    adminFeeAmount: 25000,
    packageGoodsAmount: 318000,
    emergencyDeductionAmount: 0,
  });
  assert(res1.netPayoutAmount === 4657000, 'TC-FIN-01: Lunas 50 Minggu Normal -> Payout Rp 4.657.000');

  // TC-FIN-02: Payout with Max Emergency Withdrawal (500k)
  const res2 = calculateEndCyclePayout({
    totalSavedAmount: 5000000,
    adminFeeAmount: 25000,
    packageGoodsAmount: 318000,
    emergencyDeductionAmount: 500000,
  });
  assert(res2.netPayoutAmount === 4157000, 'TC-FIN-02: Payout dengan Penarikan Darurat 500k -> Payout Rp 4.157.000');

  // TC-FIN-03: Partial Payment (45 weeks x 100k = 4.5jt, Admin 25k, Bundle 318k)
  const res3 = calculateEndCyclePayout({
    totalSavedAmount: 4500000,
    adminFeeAmount: 25000,
    packageGoodsAmount: 318000,
    emergencyDeductionAmount: 0,
  });
  assert(res3.netPayoutAmount === 4157000, 'TC-FIN-03: Pembayaran Parsial 45 Minggu -> Payout Rp 4.157.000');

  // TC-FIN-04: Excess Deductions Floor (Deductions > Total Saved -> Net Payout 0, no negative balance)
  const res4 = calculateEndCyclePayout({
    totalSavedAmount: 200000,
    adminFeeAmount: 25000,
    packageGoodsAmount: 300000,
    emergencyDeductionAmount: 0,
  });
  assert(res4.netPayoutAmount === 0, 'TC-FIN-04: Potongan melebihi saldo -> Payout Rp 0 (Non-negative floor)');

  // --- 2. EMERGENCY WITHDRAWAL VALIDATION TESTS (TC-EMG) ---
  console.log('\n🛡️ 2. Testing Emergency Withdrawal Guard Clauses (TC-EMG)');

  // TC-EMG-01: Request exceeds 500.000 limit
  const emg1 = validateEmergencyWithdrawal(2000000, 500001, 25000, 0, 0);
  assert(!emg1.isValid, 'TC-EMG-01: Permintaan > Rp 500.000 harus ditolak');

  // TC-EMG-02: Second withdrawal attempt (count >= 1)
  const emg2 = validateEmergencyWithdrawal(2000000, 200000, 25000, 1, 300000);
  assert(!emg2.isValid, 'TC-EMG-02: Percobaan penarikan kedua kali (kuota 1x habis) harus ditolak');

  // TC-EMG-03: Insufficient safe balance (Balance 300k, Admin 25k, Request 500k)
  const emg3 = validateEmergencyWithdrawal(300000, 500000, 25000, 0, 0);
  assert(!emg3.isValid, 'TC-EMG-03: Saldo berjalan tidak mencukupi (Saldo 300k < Request 500k + Admin 25k) harus ditolak');

  // TC-EMG-04: Valid Emergency Withdrawal (Balance 1.800.000, Request 400.000, Admin 25.000)
  const emg4 = validateEmergencyWithdrawal(1800000, 400000, 25000, 0, 0);
  assert(emg4.isValid, 'TC-EMG-04: Penarikan valid (Saldo 1.8jt, Request 400k, Kuota 0) harus disetujui');

  console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
