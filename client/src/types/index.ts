// ─── Auth ───────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ─── Affiliate ──────────────────────────────────────────
export interface ReferralLink {
  code: string;
  link: string;
}

export interface DashboardStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  availableBalance: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  status: 'pending' | 'purchased';
  createdAt: string;
  referredUser: { id: string; name: string; email: string };
  commissionEarned: number;
  commissionStatus: 'pending' | 'approved' | 'paid' | 'rejected' | null;
}

export interface Commission {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  description?: string;
  createdAt: string;
  purchase: { amount: number; createdAt: string };
}

// ─── Payout ─────────────────────────────────────────────
export interface PayoutRequest {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt: string | null;
}

// ─── Admin ──────────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalReferrals: number;
  totalCommissionsIssued: number;
  totalPayoutsProcessed: number;
  pendingPayouts: number;
}

export interface AdminAffiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  createdAt: string;
}

export interface AdminPayout {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  affiliate: { name: string; email: string };
}

export interface TopAffiliate {
  affiliate: { id: string; name: string; email: string };
  totalEarnings: number;
}

// ─── Generics ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
