interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <div className="glass-panel p-5 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors duration-300" />
    <div className="text-xs text-text-secondary tracking-wider uppercase mb-2 font-medium">
      {label}
    </div>
    <div className="text-3xl font-bold text-text-primary">
      {value}
    </div>
  </div>
);
