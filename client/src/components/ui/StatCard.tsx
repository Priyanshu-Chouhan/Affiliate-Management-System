export interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="text-sm font-medium text-text-secondary mb-2 relative z-10">{label}</p>
      <p className="text-3xl font-bold text-white relative z-10">{value}</p>
    </div>
  );
};
