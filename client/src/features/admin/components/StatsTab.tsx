import { StatCard } from '@/components';
import type { AdminStats } from '@/types';

export const StatsTab = ({ stats }: { stats: AdminStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Referrals', value: stats.totalReferrals },
      ].map(({ label, value }) => (
        <StatCard key={label} label={label} value={value} />
      ))}
    </div>

    <div className="glass-panel p-6">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Commission Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Issued', value: `$${Number(stats.totalCommissionsIssued).toFixed(2)}`, color: 'text-white' },
          { label: 'Approved', value: `$${Number(stats.approvedCommissions).toFixed(2)}`, color: 'text-emerald-400' },
          { label: 'Paid', value: `$${Number(stats.paidCommissions).toFixed(2)}`, color: 'text-blue-400' },
          { label: 'Pending', value: `$${Number(stats.pendingCommissions).toFixed(2)}`, color: 'text-amber-400' },
          { label: 'Rejected', value: `$${Number(stats.rejectedCommissions).toFixed(2)}`, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-background/50 rounded-xl p-4 border border-border/50">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-panel p-6">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Payout Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Approved', value: `$${Number(stats.approvedPayouts).toFixed(2)}`, color: 'text-emerald-400' },
          { label: 'Pending', value: `$${Number(stats.pendingPayouts).toFixed(2)}`, color: 'text-amber-400' },
          { label: 'Rejected', value: `$${Number(stats.rejectedPayouts).toFixed(2)}`, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-background/50 rounded-xl p-4 border border-border/50">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
