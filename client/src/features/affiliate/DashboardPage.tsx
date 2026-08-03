import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
import { purchaseApi } from '@/api/purchase.api';
import { useAuth } from '@/hooks';
import type { DashboardStats } from '@/types';
import { StatCard, ReferralLinkBox } from './components';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([affiliateApi.getDashboard(), affiliateApi.getReferralLink()])
      .then(([statsRes, linkRes]) => {
        setStats(statsRes.data.data);
        setReferralLink(linkRes.data.data.link);
      })
      .finally(() => setLoading(false));
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSimulatePurchase = async () => {
    try {
      setLoading(true);
      await purchaseApi.simulatePurchase({ amount: 1000, status: 'success' });
      // Refresh dashboard stats
      const [statsRes, linkRes] = await Promise.all([
        affiliateApi.getDashboard(),
        affiliateApi.getReferralLink(),
      ]);
      setStats(statsRes.data.data);
      setReferralLink(linkRes.data.data.link);
      alert('Purchase Successful! The referrer has received a commission.');
    } catch (err: any) {
      alert('Error making purchase: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
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
            { label: 'Pending Commissions', value: `$${(stats?.pendingCommissions ?? 0).toFixed(2)}` },
            { label: 'Approved Commissions', value: `$${(stats?.approvedCommissions ?? 0).toFixed(2)}` },
            { label: 'Paid Commissions', value: `$${(stats?.paidCommissions ?? 0).toFixed(2)}` },
          ].map(({ label, value }) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>

        {/* Link Box */}
        <ReferralLinkBox link={referralLink} />

        {/* Navigation & Actions */}
        <div className="glass-panel p-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Link to="/referrals" className="premium-button text-center w-auto">View Referrals</Link>
            <Link to="/commissions" className="premium-button text-center w-auto">View Commissions</Link>
            <Link to="/payout" className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-hover text-white transition-colors border border-border">Request Payout</Link>
          </div>
          
          <button 
            onClick={handleSimulatePurchase}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 active:scale-95"
          >
            🛒 Simulate Purchase ($1000)
          </button>
        </div>
      </div>
    </div>
  );
};
