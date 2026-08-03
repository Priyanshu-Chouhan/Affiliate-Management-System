import axiosClient from './axiosClient';

export const payoutApi = {
  requestPayout: (payload: { amount: number }) => axiosClient.post('/payout', payload),
};
