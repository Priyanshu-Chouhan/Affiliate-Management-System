import type { AdminAffiliate } from '@/types';

interface AffiliatesTabProps {
  affiliates: AdminAffiliate[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const AffiliatesTab = ({ affiliates, search, onSearchChange }: AffiliatesTabProps) => (
  <div className="glass-panel p-6">
    <input
      placeholder="Search affiliates by name or email..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="premium-input mb-6"
    />
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-text-secondary text-sm uppercase tracking-wider">
            {['Name', 'Email', 'Referral Code', 'Joined'].map((h) => (
              <th key={h} className="p-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {affiliates.map((a) => (
            <tr key={a.id} className="hover:bg-surface/50 transition-colors">
              <td className="p-4 font-medium text-white">{a.name}</td>
              <td className="p-4 text-text-secondary">{a.email}</td>
              <td className="p-4"><span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">{a.referralCode}</span></td>
              <td className="p-4 text-text-secondary">{new Date(a.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {affiliates.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-text-secondary">No affiliates found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
