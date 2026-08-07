import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetReferralsQuery } from '@/store/api';
import { Pagination, LoadingScreen } from '@/components';
import type { Referral } from '@/types';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Oldest First', value: 'createdAt:asc' },
  { label: 'Status A-Z', value: 'status:asc' },
  { label: 'Status Z-A', value: 'status:desc' },
];

export const ReferralHistoryPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt:desc');

  const [sortBy, sortOrder] = sort.split(':');
  
  const { data, isLoading: loading } = useGetReferralsQuery({ page, search, sortBy, sortOrder });

  const referrals: Referral[] = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'purchased': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  if (loading && !data) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-panel p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
            Referral History
          </h1>
          <Link to="/dashboard" className="px-5 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="glass-panel p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="premium-input flex-1"
            />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="premium-input max-w-xs appearance-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center p-12 text-primary">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
                    {['Name', 'Email', 'Referral Status', 'Commission Earned', 'Commission Status', 'Date'].map((h) => (
                      <th key={h} className="p-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {referrals.map((r) => (
                    <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4">{r.referredUser.name}</td>
                      <td className="p-4 text-text-secondary">{r.referredUser.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-primary">
                        {r.commissionEarned > 0 ? `$${Number(r.commissionEarned).toFixed(2)}` : '—'}
                      </td>
                      <td className="p-4">
                        {r.commissionStatus ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(r.commissionStatus)}`}>
                            {r.commissionStatus.charAt(0).toUpperCase() + r.commissionStatus.slice(1)}
                          </span>
                        ) : (
                          <span className="text-text-secondary">—</span>
                        )}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-secondary">
                        No referrals found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
};
