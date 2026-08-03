import { useState } from 'react';

interface ReferralLinkBoxProps {
  link: string;
}

export const ReferralLinkBox = ({ link }: ReferralLinkBoxProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 20,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: '#94a3b8',
          marginBottom: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Your Referral Link
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={link}
          readOnly
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)',
            color: '#e2e8f0',
            fontSize: 14,
          }}
        />
        <button
          onClick={copy}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: copied
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: 13,
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
