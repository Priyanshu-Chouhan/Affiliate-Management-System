interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  background: disabled ? 'transparent' : 'rgba(255,255,255,0.05)',
  color: disabled ? '#475569' : '#e2e8f0',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 13,
  fontWeight: 500,
  transition: 'all 0.15s ease',
});

export const Pagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => (
  <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
    <button onClick={onPrev} disabled={page === 1} style={btnStyle(page === 1)}>
      ← Prev
    </button>
    <span style={{ fontSize: 13, color: '#94a3b8' }}>
      Page {page} of {totalPages}
    </span>
    <button onClick={onNext} disabled={page >= totalPages} style={btnStyle(page >= totalPages)}>
      Next →
    </button>
  </div>
);
