import type { TopAffiliate } from '@/types';

interface TopAffiliatesTabProps {
  topAffiliates: TopAffiliate[];
}

export const TopAffiliatesTab = ({
  topAffiliates,
}: TopAffiliatesTabProps) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: '#f5f5f5' }}>
        {['Rank', 'Name', 'Email', 'Total Earnings'].map((h) => (
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
      {topAffiliates.map((t, i) => (
        <tr key={t.affiliate.id}>
          <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            #{i + 1}
          </td>
          <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            {t.affiliate.name}
          </td>
          <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            {t.affiliate.email}
          </td>
          <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            ${Number(t.totalEarnings).toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
