import axiosClient from '@/lib/axios';

export const affiliateApi = {
  getDashboard: () => axiosClient.get('/affiliate/dashboard'),
  getReferralLink: () => axiosClient.get('/affiliate/referral-link'),
  getReferrals: (params?: { page?: number; search?: string; sort?: string }) =>
    axiosClient.get('/affiliate/referrals', { params }),
  getCommissions: (params?: {
    page?: number;
    status?: string;
    sort?: string;
  }) => axiosClient.get('/affiliate/commissions', { params }),
};
