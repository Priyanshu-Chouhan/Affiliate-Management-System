import { StatCard as BaseStatCard } from '@/components';

interface AffiliateStatCardProps {
  label: string;
  value: string | number;
}

/**
 * Affiliate-specific stat card — wraps the base UI StatCard.
 * Can be extended with affiliate-specific icons, colors, or
 * tooltip context in the future.
 */
export const StatCard = ({ label, value }: AffiliateStatCardProps) => (
  <BaseStatCard label={label} value={value} />
);
