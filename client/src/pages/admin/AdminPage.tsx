import { useEffect, useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/api/admin.api';
import { useAuth } from '@/context/AuthContext';

type Tab = 'stats' | 'affiliates' | 'payouts' | 'top';

interface Stats {
  totalUsers: number;
  totalReferrals: number;
  totalCommissionsIssued: number;
  totalPayoutsProcessed: number;
  pendingPayouts: number;
}

interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  createdAt: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  affiliate: { name: string; email: string };
}

interface TopAffiliate {
  affiliate: { id: string; name: string; email: string };
  totalEarnings: number;
}

export const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [topAffiliates, setTopAffiliates] = useState<TopAffiliate[]>([]);
  const [search, setSearch] = useState('');
  const [payoutStatus, setPayoutStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (tab === 'stats') {
      setLoading(true);
      adminApi.getStats().then((r) => setStats(r.data.data)).finally(() => setLoading(false));
    }
    if (tab === 'affiliates') {
      setLoading(true);
      adminApi.getAffiliates({ search }).then((r) => setAffiliates(r.data.data.data)).finally(() => setLoading(false));
    }
    if (tab === 'payouts') {
      setLoading(true);
      adminApi.getPayouts(payoutStatus).then((r) => setPayouts(r.data.data)).finally(() => setLoading(false));
    }
    if (tab === 'top') {
      setLoading(true);
      adminApi.getTopAffiliates().then((r) => setTopAffiliates(r.data.data)).finally(() => setLoading(false));
    }
  }, [tab, search, payoutStatus]);

  const handlePayout = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await adminApi.approvePayout(id);
      else await adminApi.rejectPayout(id);
      setActionMsg(`Payout ${action}d`);
      adminApi.getPayouts(payoutStatus).then((r) => setPayouts(r.data.data));
    } catch {
      setActionMsg('Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 16px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: tab === t ? '2px solid #333' : '2px solid transparent',
    fontWeight: tab === t ? 'bold' : 'normal',
  });

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #ddd' }}>
        {(['stats', 'affiliates', 'payouts', 'top'] as Tab[]).map((t) => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'top' ? 'Top Affiliates' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {actionMsg && <p style={{ color: 'green', marginBottom: 12 }}>{actionMsg}</p>}
      {loading && <p>Loading...</p>}

      {!loading && tab === 'stats' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Total Referrals', value: stats.totalReferrals },
            { label: 'Commissions Issued', value: `$${Number(stats.totalCommissionsIssued).toFixed(2)}` },
            { label: 'Payouts Processed', value: `$${Number(stats.totalPayoutsProcessed).toFixed(2)}` },
            { label: 'Pending Payouts', value: `$${Number(stats.pendingPayouts).toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'affiliates' && (
        <>
          <input placeholder="Search affiliates..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ padding: 8, marginBottom: 16, width: '100%' }} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Name', 'Email', 'Referral Code', 'Joined'].map((h) => (
                  <th key={h} style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id}>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{a.name}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{a.email}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{a.referralCode}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && tab === 'payouts' && (
        <>
          <select value={payoutStatus} onChange={(e) => setPayoutStatus(e.target.value)}
            style={{ padding: 8, marginBottom: 16 }}>
            {['pending', 'approved', 'rejected', 'paid'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {['Affiliate', 'Amount', 'Status', 'Requested', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{p.affiliate.name}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>${Number(p.amount).toFixed(2)}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{p.status}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{new Date(p.requestedAt).toLocaleDateString()}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                    {p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handlePayout(p.id, 'approve')} style={{ color: 'green' }}>Approve</button>
                        <button onClick={() => handlePayout(p.id, 'reject')} style={{ color: 'red' }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#999' }}>No payouts</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {!loading && tab === 'top' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Rank', 'Name', 'Email', 'Total Earnings'].map((h) => (
                <th key={h} style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topAffiliates.map((t, i) => (
              <tr key={t.affiliate.id}>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>#{i + 1}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{t.affiliate.name}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{t.affiliate.email}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>${Number(t.totalEarnings).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
