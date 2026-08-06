import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';
import { setCredentials, logout } from './authSlice';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : args.url;
    if (!url.includes('auth/login') && !url.includes('auth/register') && !url.includes('auth/refresh')) {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;
      
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: 'auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const user = (api.getState() as RootState).auth.user;
          const resData = refreshResult.data as any;
          
          api.dispatch(
            setCredentials({
              user: user!,
              accessToken: resData.data.accessToken,
              refreshToken: resData.data.refreshToken,
            })
          );
          
          // Retry original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
