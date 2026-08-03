import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
import { useAuth } from '@/context/AuthContext';

interface Stats {
  totalReferrals: number;
  totalEarnings: number;
  availableBalance: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
}

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([affiliateApi.getDashboard(), affiliateApi.getReferralLink()])
      .then(([statsRes, linkRes]) => {
        setStats(statsRes.data.data);
        setReferralLink(linkRes.data.data.link);
      })
      .finally(() => setLoading(false));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user?.name}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, margin: '24px 0' }}>
        {[
          { label: 'Total Referrals', value: stats?.totalReferrals ?? 0 },
          { label: 'Total Earnings', value: `$${(stats?.totalEarnings ?? 0).toFixed(2)}` },
          { label: 'Available Balance', value: `$${(stats?.availableBalance ?? 0).toFixed(2)}` },
          { label: 'Pending Commissions', value: `$${(stats?.pendingCommissions ?? 0).toFixed(2)}` },
          { label: 'Approved Commissions', value: `$${(stats?.approvedCommissions ?? 0).toFixed(2)}` },
          { label: 'Paid Commissions', value: `$${(stats?.paidCommissions ?? 0).toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Your Referral Link</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={referralLink} readOnly style={{ flex: 1, padding: 8 }} />
          <button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: 16 }}>
        <Link to="/referrals">Referral History</Link>
        <Link to="/commissions">Commission History</Link>
        <Link to="/payout">Payout</Link>
      </nav>
    </div>
  );
};
