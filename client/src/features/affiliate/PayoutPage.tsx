import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { affiliateApi } from '@/api/affiliate.api';
import { payoutApi } from '@/api/payout.api';
import type { PayoutRequest } from '@/types';

export const PayoutPage = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState<PayoutRequest[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    affiliateApi
      .getDashboard()
      .then((res) => setBalance(res.data.data.availableBalance));
    payoutApi.getHistory().then((res) => setHistory(res.data.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await payoutApi.requestPayout({ amount: parseFloat(amount) });
      setSuccess('Payout request submitted!');
      setAmount('');
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error;
      setError(msg ?? 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h1>Payout</h1>
        <Link to="/dashboard">← Dashboard</Link>
      </div>

      <div
        style={{
          padding: 16,
          background: '#f0f9ff',
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <strong>Available Balance: ${Number(balance).toFixed(2)}</strong>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <h2>Request Payout</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            min={0}
            step="0.01"
            required
            onChange={(e) => setAmount(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Request'}
          </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        {success && (
          <p style={{ color: 'green', marginTop: 8 }}>{success}</p>
        )}
      </form>

      <h2>Payout History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['Amount', 'Status', 'Requested', 'Processed'].map((h) => (
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
          {history.map((p) => (
            <tr key={p.id}>
              <td
                style={{ padding: 10, borderBottom: '1px solid #eee' }}
              >
                ${Number(p.amount).toFixed(2)}
              </td>
              <td
                style={{ padding: 10, borderBottom: '1px solid #eee' }}
              >
                {p.status}
              </td>
              <td
                style={{ padding: 10, borderBottom: '1px solid #eee' }}
              >
                {new Date(p.requestedAt).toLocaleDateString()}
              </td>
              <td
                style={{ padding: 10, borderBottom: '1px solid #eee' }}
              >
                {p.processedAt
                  ? new Date(p.processedAt).toLocaleDateString()
                  : '—'}
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: 20,
                  textAlign: 'center',
                  color: '#999',
                }}
              >
                No payout requests yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
