import axiosClient from './axiosClient';

export const payoutApi = {
  requestPayout: (payload: { amount: number }) => axiosClient.post('/affiliate/payout', payload),
  getHistory: () => axiosClient.get('/affiliate/payout/history'),
};
