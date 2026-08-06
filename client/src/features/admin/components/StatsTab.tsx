import { StatCard } from '@/components';
import type { AdminStats } from '@/types';

interface StatsTabProps {
  stats: AdminStats;
}

export const StatsTab = ({ stats }: StatsTabProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[
      { label: 'Total Users', value: stats.totalUsers },
      { label: 'Total Referrals', value: stats.totalReferrals },
      {
        label: 'Commissions Issued',
        value: `$${Number(stats.totalCommissionsIssued).toFixed(2)}`,
      },
      {
        label: 'Payouts Processed',
        value: `$${Number(stats.totalPayoutsProcessed).toFixed(2)}`,
      },
      {
        label: 'Pending Payouts',
        value: `$${Number(stats.pendingPayouts).toFixed(2)}`,
      },
    ].map(({ label, value }) => (
      <StatCard key={label} label={label} value={value} />
    ))}
  </div>
);
