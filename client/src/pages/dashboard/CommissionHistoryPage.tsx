import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';

interface Commission {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  purchase: { amount: number };
}

const STATUS_OPTIONS = ['', 'pending', 'approved', 'paid', 'rejected'];

export const CommissionHistoryPage = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    affiliateApi.getCommissions({ page, status: status || undefined })
      .then((res) => {
        setCommissions(res.data.data.data);
        setTotalPages(res.data.data.meta.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Commission History</h1>
        <Link to="/dashboard">← Dashboard</Link>
      </div>
      <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        style={{ padding: 8, marginBottom: 16 }}>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
      </select>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['Purchase Amount', 'Commission', 'Status', 'Date'].map((h) => (
                <th key={h} style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>${Number(c.purchase.amount).toFixed(2)}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>${Number(c.amount).toFixed(2)}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{c.status}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {commissions.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#999' }}>No commissions found</td></tr>
            )}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};
