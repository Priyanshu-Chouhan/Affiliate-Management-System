import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Welcome, {user?.name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
          margin: '24px 0',
        }}
      >
        {[
          { label: 'Total Referrals', value: stats?.totalReferrals ?? 0 },
          { label: 'Successful Referrals', value: stats?.successfulReferrals ?? 0 },
          { label: 'Pending Referrals', value: stats?.pendingReferrals ?? 0 },
          {
            label: 'Total Earnings',
            value: `$${(stats?.totalEarnings ?? 0).toFixed(2)}`,
          },
          {
            label: 'Available Balance',
            value: `$${(stats?.availableBalance ?? 0).toFixed(2)}`,
          },
          {
            label: 'Pending Commissions',
            value: `$${(stats?.pendingCommissions ?? 0).toFixed(2)}`,
          },
          {
            label: 'Approved Commissions',
            value: `$${(stats?.approvedCommissions ?? 0).toFixed(2)}`,
          },
          {
            label: 'Paid Commissions',
            value: `$${(stats?.paidCommissions ?? 0).toFixed(2)}`,
          },
        ].map(({ label, value }) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <ReferralLinkBox link={referralLink} />

      <nav style={{ display: 'flex', gap: 16 }}>
        <Link to="/referrals">Referral History</Link>
        <Link to="/commissions">Commission History</Link>
        <Link to="/payout">Payout</Link>
      </nav>
    </div>
  );
};
