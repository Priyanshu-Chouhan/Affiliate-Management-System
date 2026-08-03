import { StatCard } from '@/components/ui';
import type { AdminStats } from '@/types';

interface StatsTabProps {
  stats: AdminStats;
}

export const StatsTab = ({ stats }: StatsTabProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16,
    }}
  >
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
