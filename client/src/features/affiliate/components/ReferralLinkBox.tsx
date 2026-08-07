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
    <div className="glass-panel p-6 mb-8 mt-4 border-primary/20">
      <div className="text-xs text-text-secondary mb-3 uppercase tracking-wider font-medium">
        Your Referral Link
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={link}
          readOnly
          className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary/50"
        />
        <button
          onClick={copy}
          className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 active:scale-95 ${
            copied
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-primary to-violet-500 shadow-primary/25 hover:from-primary-hover hover:to-violet-600'
          }`}
        >
          {copied ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};
