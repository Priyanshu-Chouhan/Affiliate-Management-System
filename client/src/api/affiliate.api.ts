import axiosClient from './axiosClient';

export const affiliateApi = {
  getDashboard: () => axiosClient.get('/affiliate/dashboard'),
  getReferrals: () => axiosClient.get('/affiliate/referrals'),
  getCommissions: () => axiosClient.get('/affiliate/commissions'),
  getReferralLink: () => axiosClient.get('/affiliate/referral-link'),
};
