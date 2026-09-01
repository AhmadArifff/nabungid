import {
  UserProfile,
  SavingsProgram,
  PackageBundle,
  ProductItem,
  WeeklyLedgerItem,
  EmergencyWithdrawalItem,
  DistributionCalculation,
  Role,
} from '@nabungid/shared';

// ==========================================
// 1. Result Pattern Architecture
// ==========================================

export type Result<T, E = string> =
  | { isSuccess: true; data: T; error?: never }
  | { isSuccess: false; data?: never; error: E; statusCode?: number };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ isSuccess: true, data }),
  fail: <E = string>(error: E, statusCode?: number): Result<never, E> => ({
    isSuccess: false,
    error,
    statusCode,
  }),
};

// ==========================================
// 2. Custom Domain Exceptions
// ==========================================

export class DomainException extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'DomainException';
  }
}

export class AuthExpiredException extends DomainException {
  constructor(message = 'Sesi login telah berakhir. Silakan masuk kembali.') {
    super(message, 401);
    this.name = 'AuthExpiredException';
  }
}

export class NetworkException extends DomainException {
  constructor(message = 'Gagal menghubungi server. Periksa koneksi internet Anda.') {
    super(message, 503);
    this.name = 'NetworkException';
  }
}

// ==========================================
// 3. Core API Request Engine with Guard Clauses
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  token?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Result<T, string>> {
  const { timeoutMs = 10000, token, headers = {}, ...restOptions } = options;

  // Guard Clause: Validate endpoint string
  if (!endpoint || typeof endpoint !== 'string') {
    return Result.fail('URL Endpoint tidak valid.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Inject Bearer token if provided or stored
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  } else if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('nabungid-auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) {
          requestHeaders['Authorization'] = `Bearer ${parsed.state.token}`;
        }
      } catch {
        // Ignore JSON parse fail
      }
    }
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Guard: HTTP 401 Unauthorized
    if (response.status === 401) {
      return Result.fail('Sesi login telah berakhir. Silakan masuk kembali.', 401);
    }

    // Guard: HTTP 403 Forbidden
    if (response.status === 403) {
      return Result.fail('Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.', 403);
    }

    const json = await response.json().catch(() => null);

    // Guard: HTTP Error status codes
    if (!response.ok) {
      const errorMessage = json?.message || `Terjadi kendala server (${response.status})`;
      return Result.fail(errorMessage, response.status);
    }

    return Result.ok(json?.data ?? (json as T));
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Guard: Abort / Timeout
    if (error.name === 'AbortError') {
      return Result.fail('Permintaan timeout (koneksi server terlalu lambat).', 408);
    }

    console.error('[API Client Network Exception]:', error);
    return Result.fail('Gagal terhubung ke server backend. Periksa koneksi Anda.', 503);
  }
}

// ==========================================
// 4. Domain Specific API Services
// ==========================================

export const authApi = {
  login: async (credentials: { phoneNumber: string; password: string }) => {
    return apiRequest<{ user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (userData: {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) => {
    return apiRequest<{ user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  getMe: async () => {
    return apiRequest<UserProfile>('/auth/me');
  },
};

export const nasabahApi = {
  getActivePrograms: async () => {
    return apiRequest<SavingsProgram[]>('/programs/active');
  },
  getBundles: async () => {
    return apiRequest<PackageBundle[]>('/programs/catalog-packages');
  },
  getSavingsLedger: async (savingId: string) => {
    return apiRequest<WeeklyLedgerItem[]>(`/nasabah/savings/${savingId}/ledger`);
  },
  payWeek: async (savingId: string, weekNumber: number, proofImageUrl: string) => {
    return apiRequest<WeeklyLedgerItem>(`/nasabah/savings/${savingId}/pay-week`, {
      method: 'POST',
      body: JSON.stringify({ weekNumber, proofImageUrl }),
    });
  },
  requestEmergencyWithdrawal: async (data: {
    savingId: string;
    amount: number;
    reason: string;
  }) => {
    return apiRequest<EmergencyWithdrawalItem>('/nasabah/withdrawals/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getWithdrawalStatus: async () => {
    return apiRequest<{ quotaUsed: boolean; withdrawals: EmergencyWithdrawalItem[] }>(
      '/nasabah/withdrawals/status'
    );
  },
};

export const adminApi = {
  getDashboardStats: async () => {
    return apiRequest<{
      totalKas: number;
      totalNasabah: number;
      pendingLedgersCount: number;
      pendingWithdrawalsCount: number;
    }>('/admin/dashboard/summary');
  },
  getPendingLedgers: async () => {
    return apiRequest<WeeklyLedgerItem[]>('/admin/ledgers/pending');
  },
  verifyLedger: async (ledgerId: string, approve: boolean, rejectionReason?: string) => {
    return apiRequest<WeeklyLedgerItem>(`/admin/ledgers/${ledgerId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ approve, rejectionReason }),
    });
  },
  getPendingWithdrawals: async () => {
    return apiRequest<EmergencyWithdrawalItem[]>('/admin/withdrawals');
  },
  decideWithdrawal: async (
    withdrawalId: string,
    approve: boolean,
    proofImageUrl?: string,
    rejectionReason?: string
  ) => {
    return apiRequest<EmergencyWithdrawalItem>(`/admin/withdrawals/${withdrawalId}/decision`, {
      method: 'PATCH',
      body: JSON.stringify({ approve, proofImageUrl, rejectionReason }),
    });
  },
  getDistributionBatch: async () => {
    return apiRequest<DistributionCalculation[]>('/admin/distribution/calculate-batch');
  },
  createProductItem: async (item: Partial<ProductItem>) => {
    return apiRequest<ProductItem>('/admin/master/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  deleteProductItem: async (itemId: string) => {
    return apiRequest<{ success: boolean }>(`/admin/master/items/${itemId}`, {
      method: 'DELETE',
    });
  },
};
