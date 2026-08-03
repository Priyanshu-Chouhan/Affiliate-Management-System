import axiosClient from '@/lib/axios';
import type { LoginPayload, RegisterPayload } from '@/types';

export const authApi = {
  login: (payload: LoginPayload) => axiosClient.post('/auth/login', payload),
  register: (payload: RegisterPayload) =>
    axiosClient.post('/auth/register', payload),
  refresh: () => axiosClient.post('/auth/refresh'),
};
