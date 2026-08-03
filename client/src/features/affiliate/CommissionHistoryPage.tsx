import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
import { Pagination } from '@/components/ui';
import type { Commission } from '@/types';

const STATUS_OPTIONS = ['', 'pending', 'approved', 'paid', 'rejected'];

export const CommissionHistoryPage = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    affiliateApi
      .getCommissions({ page, status: status || undefined })
      .then((res) => {
        setCommissions(res.data.data.data);
        setTotalPages(res.data.data.meta.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h1>Commission History</h1>
        <Link to="/dashboard">← Dashboard</Link>
      </div>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        style={{ padding: 8, marginBottom: 16 }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s || 'All Statuses'}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Purchase Amount', 'Commission', 'Status', 'Description', 'Date'].map(
                (h) => (
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id}>
                <td
                  style={{ padding: 10, borderBottom: '1px solid #eee' }}
                >
                  ${Number(c.purchase.amount).toFixed(2)}
                </td>
                <td
                  style={{ padding: 10, borderBottom: '1px solid #eee' }}
                >
                  ${Number(c.amount).toFixed(2)}
                </td>
                <td
                  style={{ padding: 10, borderBottom: '1px solid #eee' }}
                >
                  {c.status}
                </td>
                <td
                  style={{ padding: 10, borderBottom: '1px solid #eee' }}
                >
                  {c.description || '-'}
                </td>
                <td
                  style={{ padding: 10, borderBottom: '1px solid #eee' }}
                >
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {commissions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: 20,
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  No commissions found
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
