import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { 
  useGetAdminStatsQuery,
  useGetAdminAffiliatesQuery,
  useGetAdminPayoutsQuery,
  useGetAdminTopAffiliatesQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation
} from '@/store/api';
import {
  StatsTab,
  AffiliatesTab,
  PayoutsTab,
  TopAffiliatesTab,
  CommissionsTab,
} from './components';

type Tab = 'stats' | 'affiliates' | 'payouts' | 'commissions' | 'top';

const TAB_LABELS: Record<Tab, string> = {
  stats: 'Referral Statistics',
  affiliates: 'All Affiliates',
  payouts: 'Payout Requests',
  commissions: 'Commission History',
  top: 'Top Affiliates',
};

export const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('stats');
  
  const [search, setSearch] = useState('');
  const [payoutStatus, setPayoutStatus] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const { data: statsData, isLoading: loadingStats } = useGetAdminStatsQuery(undefined, { skip: tab !== 'stats' });
  const { data: affiliatesData, isLoading: loadingAffiliates } = useGetAdminAffiliatesQuery({ search }, { skip: tab !== 'affiliates' });
  const { data: payoutsData, isLoading: loadingPayouts } = useGetAdminPayoutsQuery({ status: payoutStatus }, { skip: tab !== 'payouts' });
  const { data: topAffiliatesData, isLoading: loadingTop } = useGetAdminTopAffiliatesQuery(undefined, { skip: tab !== 'top' });

  const [approvePayout] = useApprovePayoutMutation();
  const [rejectPayout] = useRejectPayoutMutation();

  const handlePayout = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await approvePayout(id).unwrap();
      else await rejectPayout(id).unwrap();
      setActionMsg(`Payout ${action}d successfully`);
    } catch {
      setActionMsg('Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const loading = loadingStats || loadingAffiliates || loadingPayouts || loadingTop;

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-panel p-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              Admin Portal
            </h1>
            <p className="text-text-secondary mt-1">Manage affiliates, payouts, and system stats.</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-6 py-2 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-surface/50 rounded-2xl border border-border/50 flex-wrap overflow-x-auto">
          {(['stats', 'affiliates', 'payouts', 'commissions', 'top'] as Tab[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                tab === t 
                  ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {actionMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-sm animate-fade-in-up">
            {actionMsg}
          </div>
        )}

        {/* Content Area */}
        <div className="animate-fade-in-up min-h-[400px]">
          {loading ? (
            <div className="flex justify-center p-20 text-primary">
              <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {tab === 'stats' && statsData?.data && <StatsTab stats={statsData.data} />}
              {tab === 'affiliates' && <AffiliatesTab affiliates={affiliatesData?.data?.data || []} search={search} onSearchChange={setSearch} />}
              {tab === 'payouts' && <PayoutsTab payouts={payoutsData?.data || []} payoutStatus={payoutStatus} onStatusChange={setPayoutStatus} onAction={handlePayout} />}
              {tab === 'commissions' && <CommissionsTab />}
              {tab === 'top' && <TopAffiliatesTab topAffiliates={topAffiliatesData?.data || []} />}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
