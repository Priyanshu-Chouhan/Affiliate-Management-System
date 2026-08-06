interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export const Pagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
  const btnClass = "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button 
        onClick={onPrev} 
        disabled={page === 1} 
        className={`${btnClass} ${page === 1 ? 'bg-transparent text-text-secondary border-border/50' : 'bg-surface/50 text-text-primary hover:bg-surface border-border'}`}
      >
        ← Prev
      </button>
      <span className="text-sm text-text-secondary font-medium">
        Page {page} of {totalPages}
      </span>
      <button 
        onClick={onNext} 
        disabled={page >= totalPages} 
        className={`${btnClass} ${page >= totalPages ? 'bg-transparent text-text-secondary border-border/50' : 'bg-surface/50 text-text-primary hover:bg-surface border-border'}`}
      >
        Next →
      </button>
    </div>
  );
};
