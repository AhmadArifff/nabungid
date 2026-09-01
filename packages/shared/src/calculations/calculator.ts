export interface SavingsSimulationInput {
  weeklyNominal: number; // e.g. 100000
  totalWeeks?: number; // default 50
  adminFee?: number; // default 25000
  selectedPackagePrice?: number; // default 0
  emergencyWithdrawalAmount?: number; // default 0
}

export interface SavingsSimulationResult {
  weeklyNominal: number;
  totalWeeks: number;
  grossSavings: number; // e.g. 50 * 100,000 = 5,000,000
  adminFee: number;
  selectedPackagePrice: number;
  emergencyWithdrawalAmount: number;
  netCashReceived: number; // gross - admin - package - emergency
  progressPercentage: number;
}

export function simulateSavings(input: SavingsSimulationInput): SavingsSimulationResult {
  const weeklyNominal = Math.max(0, input.weeklyNominal);
  const totalWeeks = input.totalWeeks ?? 50;
  const adminFee = input.adminFee ?? 25000;
  const selectedPackagePrice = Math.max(0, input.selectedPackagePrice ?? 0);
  const emergencyWithdrawalAmount = Math.max(0, input.emergencyWithdrawalAmount ?? 0);

  const grossSavings = weeklyNominal * totalWeeks;
  const totalDeductions = adminFee + selectedPackagePrice + emergencyWithdrawalAmount;
  const netCashReceived = Math.max(0, grossSavings - totalDeductions);

  return {
    weeklyNominal,
    totalWeeks,
    grossSavings,
    adminFee,
    selectedPackagePrice,
    emergencyWithdrawalAmount,
    netCashReceived,
    progressPercentage: Math.min(100, (netCashReceived / (grossSavings || 1)) * 100),
  };
}

/**
 * Recommends optimal weekly savings amount based on selected custom goods
 */
export function recommendWeeklySavingsForGoods(
  totalGoodsValue: number,
  desiredCashReturn: number = 1000000,
  adminFee: number = 25000,
  weeks: number = 50
): { recommendedWeeklyNominal: number; roundedWeeklyNominal: number } {
  const targetTotal = totalGoodsValue + desiredCashReturn + adminFee;
  const exactPerWeek = targetTotal / weeks;
  // Round up to nearest 5,000
  const roundedWeeklyNominal = Math.ceil(exactPerWeek / 5000) * 5000;

  return {
    recommendedWeeklyNominal: exactPerWeek,
    roundedWeeklyNominal: Math.max(25000, roundedWeeklyNominal),
  };
}
