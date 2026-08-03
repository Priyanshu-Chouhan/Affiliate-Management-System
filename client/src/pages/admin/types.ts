export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface ReferralLink {
  code: string;
  link: string;
}

export interface DashboardStats {
  totalReferrals: number;
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
}

export interface Commission {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
  purchase: { amount: number; createdAt: string };
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
