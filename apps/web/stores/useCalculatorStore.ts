import { create } from 'zustand';
import { simulateSavings, SavingsSimulationResult } from '@nabungid/shared';

interface CalculatorState {
  weeklyNominal: number;
  totalWeeks: number;
  adminFee: number;
  selectedPackagePrice: number;
  emergencyWithdrawalAmount: number;
  simulation: SavingsSimulationResult;
  setWeeklyNominal: (nominal: number) => void;
  setPackagePrice: (price: number) => void;
  setEmergencyWithdrawal: (amount: number) => void;
  reset: () => void;
}

const DEFAULT_WEEKLY = 100000;
const DEFAULT_WEEKS = 50;
const DEFAULT_ADMIN_FEE = 25000;

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  weeklyNominal: DEFAULT_WEEKLY,
  totalWeeks: DEFAULT_WEEKS,
  adminFee: DEFAULT_ADMIN_FEE,
  selectedPackagePrice: 0,
  emergencyWithdrawalAmount: 0,
  simulation: simulateSavings({
    weeklyNominal: DEFAULT_WEEKLY,
    totalWeeks: DEFAULT_WEEKS,
    adminFee: DEFAULT_ADMIN_FEE,
    selectedPackagePrice: 0,
    emergencyWithdrawalAmount: 0,
  }),

  setWeeklyNominal: (nominal: number) => {
    const state = get();
    const updated = simulateSavings({
      weeklyNominal: nominal,
      totalWeeks: state.totalWeeks,
      adminFee: state.adminFee,
      selectedPackagePrice: state.selectedPackagePrice,
      emergencyWithdrawalAmount: state.emergencyWithdrawalAmount,
    });
    set({ weeklyNominal: nominal, simulation: updated });
  },

  setPackagePrice: (price: number) => {
    const state = get();
    const updated = simulateSavings({
      weeklyNominal: state.weeklyNominal,
      totalWeeks: state.totalWeeks,
      adminFee: state.adminFee,
      selectedPackagePrice: price,
      emergencyWithdrawalAmount: state.emergencyWithdrawalAmount,
    });
    set({ selectedPackagePrice: price, simulation: updated });
  },

  setEmergencyWithdrawal: (amount: number) => {
    const state = get();
    const safeAmount = Math.min(500000, Math.max(0, amount));
    const updated = simulateSavings({
      weeklyNominal: state.weeklyNominal,
      totalWeeks: state.totalWeeks,
      adminFee: state.adminFee,
      selectedPackagePrice: state.selectedPackagePrice,
      emergencyWithdrawalAmount: safeAmount,
    });
    set({ emergencyWithdrawalAmount: safeAmount, simulation: updated });
  },

  reset: () => {
    set({
      weeklyNominal: DEFAULT_WEEKLY,
      selectedPackagePrice: 0,
      emergencyWithdrawalAmount: 0,
      simulation: simulateSavings({
        weeklyNominal: DEFAULT_WEEKLY,
        totalWeeks: DEFAULT_WEEKS,
        adminFee: DEFAULT_ADMIN_FEE,
        selectedPackagePrice: 0,
        emergencyWithdrawalAmount: 0,
      }),
    });
  },
}));
