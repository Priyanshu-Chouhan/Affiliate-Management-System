import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
import { Pagination } from '@/components/ui';
import type { Referral } from '@/types';

export const ReferralHistoryPage = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    affiliateApi
      .getReferrals({ page, search })
      .then((res) => {
        setReferrals(res.data.data.data);
        setTotalPages(res.data.data.meta.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h1>Referral History</h1>
        <Link to="/dashboard">← Dashboard</Link>
      </div>
      <input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ padding: 8, marginBottom: 16, width: '100%' }}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Name', 'Email', 'Status', 'Date'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 10,
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id}>
                <td
                  style={{
                    padding: 10,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {r.referredUser.name}
                </td>
                <td
                  style={{
                    padding: 10,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {r.referredUser.email}
                </td>
                <td
                  style={{
                    padding: 10,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {r.status}
                </td>
                <td
                  style={{
                    padding: 10,
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {referrals.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: 20,
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  No referrals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
};
