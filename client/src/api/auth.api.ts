import axiosClient from './axiosClient';

export const authApi = {
  login: (payload: { email: string; password: string }) => axiosClient.post('/auth/login', payload),
  register: (payload: { name: string; email: string; password: string; referralCode?: string }) =>
    axiosClient.post('/auth/register', payload),
  refresh: () => axiosClient.post('/auth/refresh'),
};
