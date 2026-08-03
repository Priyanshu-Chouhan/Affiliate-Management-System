import type { AdminPayout } from '@/types';

interface PayoutsTabProps {
  payouts: AdminPayout[];
  payoutStatus: string;
  onStatusChange: (value: string) => void;
  onAction: (id: string, action: 'approve' | 'reject') => void;
}

const PAYOUT_STATUSES = ['pending', 'approved', 'rejected', 'paid'];

export const PayoutsTab = ({
  payouts,
  payoutStatus,
  onStatusChange,
  onAction,
}: PayoutsTabProps) => (
  <>
    <select
      value={payoutStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      style={{ padding: 8, marginBottom: 16 }}
    >
      {PAYOUT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          {['Affiliate', 'Amount', 'Status', 'Requested', 'Actions'].map(
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
        {payouts.map((p) => (
          <tr key={p.id}>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {p.affiliate.name}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              ${Number(p.amount).toFixed(2)}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {p.status}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {new Date(p.requestedAt).toLocaleDateString()}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {p.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onAction(p.id, 'approve')}
                    style={{ color: 'green' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onAction(p.id, 'reject')}
                    style={{ color: 'red' }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        {payouts.length === 0 && (
          <tr>
            <td
              colSpan={5}
              style={{ padding: 20, textAlign: 'center', color: '#999' }}
            >
              No payouts
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </>
);
