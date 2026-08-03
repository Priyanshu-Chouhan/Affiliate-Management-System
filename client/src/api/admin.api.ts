import axiosClient from '@/lib/axios';

export const adminApi = {
  getAffiliates: (params?: { page?: number; search?: string }) =>
    axiosClient.get('/admin/affiliates', { params }),
  getAffiliate: (id: string) => axiosClient.get(`/admin/affiliates/${id}`),
  getPayouts: (status?: string) =>
    axiosClient.get('/admin/payouts', { params: { status } }),
  approvePayout: (id: string) =>
    axiosClient.patch(`/admin/payouts/${id}/approve`),
  rejectPayout: (id: string) =>
    axiosClient.patch(`/admin/payouts/${id}/reject`),
  getCommissions: () => axiosClient.get('/admin/commissions'),
  getStats: () => axiosClient.get('/admin/stats'),
  getTopAffiliates: () => axiosClient.get('/admin/top-affiliates'),
};
