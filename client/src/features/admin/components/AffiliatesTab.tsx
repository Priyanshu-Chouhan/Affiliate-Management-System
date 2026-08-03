import type { AdminAffiliate } from '@/types';

interface AffiliatesTabProps {
  affiliates: AdminAffiliate[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const AffiliatesTab = ({
  affiliates,
  search,
  onSearchChange,
}: AffiliatesTabProps) => (
  <>
    <input
      placeholder="Search affiliates..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      style={{ padding: 8, marginBottom: 16, width: '100%' }}
    />
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          {['Name', 'Email', 'Referral Code', 'Joined'].map((h) => (
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
          ))}
        </tr>
      </thead>
      <tbody>
        {affiliates.map((a) => (
          <tr key={a.id}>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {a.name}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {a.email}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {a.referralCode}
            </td>
            <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
              {new Date(a.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
