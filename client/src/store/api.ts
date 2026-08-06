import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'PayoutHistory', 'Admin', 'AdminPayouts'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: 'auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation({
      query: (userData) => ({ url: 'auth/register', method: 'POST', body: userData }),
    }),
    
    // Affiliate Endpoints
    getDashboard: builder.query({
      query: () => 'affiliate/dashboard',
      providesTags: ['Dashboard'],
    }),
    getReferralLink: builder.query({
      query: () => 'affiliate/referral-link',
    }),
    getReferrals: builder.query({
      query: (params) => ({
        url: 'affiliate/referrals',
        params,
      }),
    }),
    getCommissions: builder.query({
      query: (params) => ({
        url: 'affiliate/commissions',
        params,
      }),
    }),
    requestPayout: builder.mutation({
      query: (body) => ({ url: 'payout', method: 'POST', body }),
      invalidatesTags: ['Dashboard', 'PayoutHistory'],
    }),
    getPayoutHistory: builder.query({
      query: () => 'payout/history',
      providesTags: ['PayoutHistory'],
    }),
    
    // Purchase Simulation
    simulatePurchase: builder.mutation({
      query: (body) => ({ url: 'purchases', method: 'POST', body }),
      invalidatesTags: ['Dashboard'],
    }),

    // Admin Endpoints
    getAdminStats: builder.query({
      query: () => 'admin/stats',
      providesTags: ['Admin'],
    }),
    getAdminAffiliates: builder.query({
      query: (params) => ({
        url: 'admin/affiliates',
        params,
      }),
    }),
    getAdminPayouts: builder.query({
      query: (params) => ({
        url: 'admin/payouts',
        params,
      }),
      providesTags: ['AdminPayouts'],
    }),
    approvePayout: builder.mutation({
      query: (id) => ({ url: `admin/payouts/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: ['Admin', 'AdminPayouts'],
    }),
    rejectPayout: builder.mutation({
      query: (id) => ({ url: `admin/payouts/${id}/reject`, method: 'PATCH' }),
      invalidatesTags: ['Admin', 'AdminPayouts'],
    }),
    getAdminCommissions: builder.query({
      query: () => 'admin/commissions',
    }),
    getAdminTopAffiliates: builder.query({
      query: () => 'admin/top-affiliates',
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useGetDashboardQuery,
  useGetReferralLinkQuery,
  useGetReferralsQuery,
  useGetCommissionsQuery,
  useRequestPayoutMutation,
  useGetPayoutHistoryQuery,
  useSimulatePurchaseMutation,
  useGetAdminStatsQuery,
  useGetAdminAffiliatesQuery,
  useGetAdminPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
  useGetAdminCommissionsQuery,
  useGetAdminTopAffiliatesQuery
} = api;
