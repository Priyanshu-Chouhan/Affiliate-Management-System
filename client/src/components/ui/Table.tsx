import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({ columns, data, rowKey, emptyMessage = 'No data found' }: TableProps<T>) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={rowKey(row)}
            style={{ transition: 'background 0.15s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
            }}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: '#cbd5e1',
                  fontSize: 14,
                }}
              >
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              style={{
                padding: 32,
                textAlign: 'center',
                color: '#64748b',
                fontSize: 14,
              }}
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
