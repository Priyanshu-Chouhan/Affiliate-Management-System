import type { TopAffiliate } from '@/types';

interface TopAffiliatesTabProps {
  topAffiliates: TopAffiliate[];
}

export const TopAffiliatesTab = ({ topAffiliates }: TopAffiliatesTabProps) => (
  <div className="glass-panel p-6">
    <h2 className="text-xl font-medium text-white mb-6">Top Performing Affiliates</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
            {['Rank', 'Name', 'Email', 'Total Earnings'].map((h) => (
              <th key={h} className="p-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {topAffiliates.map((a, idx) => (
            <tr key={a.affiliate.id} className="hover:bg-surface/50 transition-colors">
              <td className="p-4">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                  idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                  idx === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' :
                  idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' :
                  'bg-surface text-text-secondary'
                }`}>
                  {idx + 1}
                </span>
              </td>
              <td className="p-4 font-medium text-white">{a.affiliate.name}</td>
              <td className="p-4 text-text-secondary">{a.affiliate.email}</td>
              <td className="p-4 font-bold text-emerald-400">${Number(a.totalEarnings).toFixed(2)}</td>
            </tr>
          ))}
          {topAffiliates.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-text-secondary">No earnings data available yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
