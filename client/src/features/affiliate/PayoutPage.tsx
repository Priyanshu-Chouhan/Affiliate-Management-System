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

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-panel p-6">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
              Payout Request
            </h1>
            <p className="text-text-secondary mt-1">Withdraw your available earnings</p>
          </div>
          <Link to="/dashboard" className="px-5 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-white">${Number(balance).toFixed(2)}</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Request Payout</h2>
              
              <div>
                <label className="block text-sm text-text-secondary mb-1">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  min={1}
                  step="0.01"
                  required
                  onChange={(e) => setAmount(e.target.value)}
                  className="premium-input text-lg"
                />
              </div>

              {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
              {success && <div className="text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">{success}</div>}

              <button type="submit" disabled={loading || parseFloat(amount || '0') > balance} className="premium-button mt-4">
                {loading ? 'Submitting...' : 'Request Payout'}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="md:col-span-2 glass-panel p-6">
            <h2 className="text-lg font-medium text-white mb-6">Payout History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
                    {['Amount', 'Status', 'Requested', 'Processed'].map((h) => (
                      <th key={h} className="p-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {history.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-bold text-white">${Number(p.amount).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary">{new Date(p.requestedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-text-secondary">
                        {p.processedAt ? new Date(p.processedAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">
                        No payout requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
