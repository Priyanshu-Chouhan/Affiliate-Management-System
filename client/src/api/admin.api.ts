import axiosClient from './axiosClient';

export const adminApi = {
  getAffiliates: () => axiosClient.get('/admin/affiliates'),
  getStats: () => axiosClient.get('/admin/stats'),
  getPayouts: () => axiosClient.get('/admin/payouts'),
};
