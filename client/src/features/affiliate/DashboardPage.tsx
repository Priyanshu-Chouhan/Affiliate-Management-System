import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import type { RootState } from '@/store';
import { 
  useGetDashboardQuery, 
  useGetReferralLinkQuery, 
  useSimulatePurchaseMutation 
} from '@/store/api';
import { StatCard, ReferralLinkBox } from './components';
import { LoadingScreen } from '@/components';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  
  const { data: dashboardData, isLoading: isLoadingStats } = useGetDashboardQuery(undefined);
  const { data: linkData, isLoading: isLoadingLink } = useGetReferralLinkQuery(undefined);
  const [simulatePurchase, { isLoading: isPurchasing }] = useSimulatePurchaseMutation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSimulatePurchase = async () => {
    try {
      await simulatePurchase({ amount: 1000, status: 'success' }).unwrap();
      alert('Purchase Successful!');
    } catch (err: any) {
      alert('Error making purchase: ' + (err.data?.error || err.message));
    }
  };

  if (isLoadingStats || isLoadingLink) return <LoadingScreen />;

  const stats = dashboardData?.data;
  const referralLink = linkData?.data?.link || '';

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
              Welcome back, {user?.name}
            </h1>
            <p className="text-text-secondary mt-1">Here's what's happening with your referrals today.</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors">
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Referrals', value: stats?.totalReferrals ?? 0 },
            { label: 'Successful Referrals', value: stats?.successfulReferrals ?? 0 },
            { label: 'Pending Referrals', value: stats?.pendingReferrals ?? 0 },
            { label: 'Total Earnings', value: `$${(stats?.totalEarnings ?? 0).toFixed(2)}` },
            { label: 'Available Balance', value: `$${(stats?.availableBalance ?? 0).toFixed(2)}` },
            { label: 'Pending Commission', value: `$${(stats?.pendingCommissions ?? 0).toFixed(2)}` },
            { label: 'Approved Commission', value: `$${(stats?.approvedCommissions ?? 0).toFixed(2)}` },
            { label: 'Paid Commission', value: `$${(stats?.paidCommissions ?? 0).toFixed(2)}` },
          ].map(({ label, value }) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>

        {/* Link Box */}
        <ReferralLinkBox link={referralLink} />

        {/* Navigation & Actions */}
        <div className="glass-panel p-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Link to="/referrals" className="premium-button text-center w-auto">Referral History</Link>
            <Link to="/commissions" className="premium-button text-center w-auto">Commission History</Link>
            <Link to="/payout" className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-hover text-white transition-colors border border-border">Payout Request</Link>
          </div>
          
          <button 
            onClick={handleSimulatePurchase}
            disabled={isPurchasing}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${
              isPurchasing 
                ? 'bg-surface-hover text-text-secondary cursor-not-allowed'
                : 'bg-surface-hover hover:bg-border text-white shadow-sm border border-border'
            }`}
          >
            {isPurchasing ? 'Processing...' : '🛒 Simulate Purchase ($1000)'}
          </button>
        </div>
      </div>
    </div>
  );
};
