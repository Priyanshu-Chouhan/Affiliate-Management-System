import { useGetAdminCommissionsQuery, useApproveCommissionMutation, useRejectCommissionMutation } from '@/store/api';

const getStatusColor = (s: string) => {
  switch (s) {
    case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
};

export const CommissionsTab = () => {
  const { data, isLoading } = useGetAdminCommissionsQuery(undefined);
  const [approveCommission] = useApproveCommissionMutation();
  const [rejectCommission] = useRejectCommissionMutation();
  const commissions = data?.data || [];

  if (isLoading) return (
    <div className="flex justify-center p-20 text-primary">
      <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );

  return (
    <div className="glass-panel p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
              {['Affiliate', 'Amount', 'Status', 'Description', 'Date', 'Action'].map((h) => (
                <th key={h} className="p-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {commissions.map((c: any) => (
              <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{c.affiliate.name}</div>
                  <div className="text-sm text-text-secondary">{c.affiliate.email}</div>
                </td>
                <td className="p-4 font-bold text-emerald-400">${Number(c.amount).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.status)}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-text-secondary">{c.description || '—'}</td>
                <td className="p-4 text-text-secondary">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  {c.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveCommission(c.id)}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectCommission(c.id)}
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
            {commissions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">No commissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
