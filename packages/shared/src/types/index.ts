export type Role = 'ADMIN' | 'NASABAH';

export type SavingsStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type LedgerStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

export type WithdrawalStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'QRIS';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  avatarUrl?: string | null;
  address?: string | null;
}

export interface SavingsProgram {
  id: string;
  cycleId: string;
  name: string;
  weeklyNominal: number;
  targetWeeks: number;
  adminFee: number;
  description?: string | null;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface ProductItem {
  id: string;
  categoryId: string;
  name: string;
  unit: string;
  estimatedPrice: number;
  imageUrl?: string | null;
  description?: string | null;
  isAvailable: boolean;
  category?: ProductCategory;
}

export interface PackageBundle {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bundlePrice: number;
  imageUrl?: string | null;
  isActive: boolean;
  items?: Array<{
    item: ProductItem;
    quantity: number;
  }>;
}

export interface WeeklyLedgerItem {
  id: string;
  memberSavingId: string;
  weekNumber: number;
  dueDate: string;
  paidDate?: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  proofImageUrl?: string | null;
  status: LedgerStatus;
  rejectionReason?: string | null;
}

export interface EmergencyWithdrawalRequest {
  id: string;
  memberSavingId: string;
  userId: string;
  amount: number;
  reason: string;
  status: WithdrawalStatus;
  proofImageUrl?: string | null;
  createdAt: string;
}

export type EmergencyWithdrawalItem = EmergencyWithdrawalRequest;


export interface DistributionPayoutSummary {
  totalSavedAmount: number;
  adminFeeAmount: number;
  packageGoodsAmount: number;
  emergencyDeductionAmount: number;
  netPayoutAmount: number;
  payoutDate: string;
  isDisbursed: boolean;
}

export type DistributionCalculation = DistributionPayoutSummary;

