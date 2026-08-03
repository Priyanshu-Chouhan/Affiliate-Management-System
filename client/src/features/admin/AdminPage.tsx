import { useEffect, useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/api/admin.api';
import { useAuth } from '@/hooks';
import type {
  AdminStats,
  AdminAffiliate,
  AdminPayout,
  TopAffiliate,
} from '@/types';
import {
  StatsTab,
  AffiliatesTab,
  PayoutsTab,
  TopAffiliatesTab,
} from './components';

type Tab = 'stats' | 'affiliates' | 'payouts' | 'top';

export const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [topAffiliates, setTopAffiliates] = useState<TopAffiliate[]>([]);
  const [search, setSearch] = useState('');
  const [payoutStatus, setPayoutStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (tab === 'stats') {
      setLoading(true);
      adminApi
        .getStats()
        .then((r) => setStats(r.data.data))
        .finally(() => setLoading(false));
    }
    if (tab === 'affiliates') {
      setLoading(true);
      adminApi
        .getAffiliates({ search })
        .then((r) => setAffiliates(r.data.data.data))
        .finally(() => setLoading(false));
    }
    if (tab === 'payouts') {
      setLoading(true);
      adminApi
        .getPayouts(payoutStatus)
        .then((r) => setPayouts(r.data.data))
        .finally(() => setLoading(false));
    }
    if (tab === 'top') {
      setLoading(true);
      adminApi
        .getTopAffiliates()
        .then((r) => setTopAffiliates(r.data.data))
        .finally(() => setLoading(false));
    }
  }, [tab, search, payoutStatus]);

  const handlePayout = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await adminApi.approvePayout(id);
      else await adminApi.rejectPayout(id);
      setActionMsg(`Payout ${action}d`);
      adminApi
        .getPayouts(payoutStatus)
        .then((r) => setPayouts(r.data.data));
    } catch {
      setActionMsg('Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          borderBottom: '1px solid #ddd',
        }}
      >
        {(['stats', 'affiliates', 'payouts', 'top'] as Tab[]).map((t) => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'top'
              ? 'Top Affiliates'
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {actionMsg && (
        <p style={{ color: 'green', marginBottom: 12 }}>{actionMsg}</p>
      )}
      {loading && <p>Loading...</p>}

      {!loading && tab === 'stats' && stats && <StatsTab stats={stats} />}

      {!loading && tab === 'affiliates' && (
        <AffiliatesTab
          affiliates={affiliates}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {!loading && tab === 'payouts' && (
        <PayoutsTab
          payouts={payouts}
          payoutStatus={payoutStatus}
          onStatusChange={setPayoutStatus}
          onAction={handlePayout}
        />
      )}

      {!loading && tab === 'top' && (
        <TopAffiliatesTab topAffiliates={topAffiliates} />
      )}
    </div>
  );
};
