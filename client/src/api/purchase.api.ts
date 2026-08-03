import axiosClient from '@/lib/axios';

export const purchaseApi = {
  simulatePurchase: (data: { amount: number; status: string }) =>
    axiosClient.post('/purchases', data),
};
