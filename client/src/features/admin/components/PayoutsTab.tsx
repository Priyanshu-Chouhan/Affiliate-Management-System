import type { AdminPayout } from '@/types';

interface PayoutsTabProps {
  payouts: AdminPayout[];
  payoutStatus: string;
  onStatusChange: (status: string) => void;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

export const PayoutsTab = ({ payouts, payoutStatus, onStatusChange, onAction }: PayoutsTabProps) => (
  <div className="glass-panel p-6">
    <select
      value={payoutStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      className="premium-input mb-6 max-w-xs appearance-none"
    >
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
      <option value="paid">Paid</option>
    </select>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
            {['Affiliate', 'Amount', 'Date', 'Action'].map((h) => (
              <th key={h} className="p-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {payouts.map((p) => (
            <tr key={p.id} className="hover:bg-surface/50 transition-colors">
              <td className="p-4">
                <div className="font-medium text-white">{p.affiliate.name}</div>
                <div className="text-sm text-text-secondary">{p.affiliate.email}</div>
              </td>
              <td className="p-4 font-bold text-emerald-400">${Number(p.amount).toFixed(2)}</td>
              <td className="p-4 text-text-secondary">{new Date(p.requestedAt).toLocaleDateString()}</td>
              <td className="p-4">
                {p.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAction(p.id, 'approve')}
                      className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction(p.id, 'reject')}
                      className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-text-secondary italic">Processed</span>
                )}
              </td>
            </tr>
          ))}
          {payouts.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-text-secondary">No payouts found for this status.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
