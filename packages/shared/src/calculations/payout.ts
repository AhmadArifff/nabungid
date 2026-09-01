import { DistributionPayoutSummary } from '../types';

export interface PayoutInput {
  totalSavedAmount: number;
  adminFeeAmount: number;
  packageGoodsAmount: number;
  emergencyDeductionAmount: number;
  payoutDate?: string;
}

/**
 * Pure calculation function for End-of-Cycle (H-1 Idul Fitri) Distribution
 * Formula: Net Payout = Total Saved - Admin Fee - Package Goods Value - Emergency Withdrawals
 */
export function calculateEndCyclePayout(input: PayoutInput): DistributionPayoutSummary {
  const {
    totalSavedAmount = 0,
    adminFeeAmount = 0,
    packageGoodsAmount = 0,
    emergencyDeductionAmount = 0,
    payoutDate = new Date().toISOString(),
  } = input;

  const totalDeductions = adminFeeAmount + packageGoodsAmount + emergencyDeductionAmount;
  const netPayoutAmount = Math.max(0, totalSavedAmount - totalDeductions);

  return {
    totalSavedAmount,
    adminFeeAmount,
    packageGoodsAmount,
    emergencyDeductionAmount,
    netPayoutAmount,
    payoutDate,
    isDisbursed: false,
  };
}

export interface EmergencyValidationResult {
  isValid: boolean;
  message?: string;
  maxAllowed: number;
}

export const EMERGENCY_WITHDRAWAL_MAX_LIMIT = 500000; // Rp 500.000 max
export const EMERGENCY_WITHDRAWAL_MAX_COUNT = 1; // 1 time limit

/**
 * Validates emergency withdrawal requests according to PRD business rules
 */
export function validateEmergencyWithdrawal(
  currentBalance: number,
  requestedAmount: number,
  adminFee: number,
  previousWithdrawalCount: number,
  totalAlreadyWithdrawn: number
): EmergencyValidationResult {
  if (previousWithdrawalCount >= EMERGENCY_WITHDRAWAL_MAX_COUNT || totalAlreadyWithdrawn >= EMERGENCY_WITHDRAWAL_MAX_LIMIT) {
    return {
      isValid: false,
      message: 'Anda sudah mencapai batas maksimal penarikan darurat (Maksimal 1x penarikan per siklus).',
      maxAllowed: 0,
    };
  }

  const remainingLimit = EMERGENCY_WITHDRAWAL_MAX_LIMIT - totalAlreadyWithdrawn;

  if (requestedAmount > remainingLimit) {
    return {
      isValid: false,
      message: `Nominal penarikan melebihi sisa batas darurat maksimal (Maks Rp ${remainingLimit.toLocaleString('id-ID')}).`,
      maxAllowed: remainingLimit,
    };
  }

  if (requestedAmount <= 0) {
    return {
      isValid: false,
      message: 'Nominal penarikan harus lebih besar dari Rp 0.',
      maxAllowed: remainingLimit,
    };
  }

  const minRequiredBalance = requestedAmount + adminFee;
  if (currentBalance < minRequiredBalance) {
    return {
      isValid: false,
      message: `Saldo tabungan saat ini (Rp ${currentBalance.toLocaleString('id-ID')}) tidak mencukupi untuk penarikan dan cadangan biaya admin.`,
      maxAllowed: Math.max(0, currentBalance - adminFee),
    };
  }

  return {
    isValid: true,
    maxAllowed: remainingLimit,
  };
}
