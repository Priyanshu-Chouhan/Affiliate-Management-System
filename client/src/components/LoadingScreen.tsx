export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Spinner */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-surface border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"></div>
        <p className="mt-6 text-lg font-medium text-text-secondary animate-pulse">Loading data...</p>
      </div>
    </div>
  );
};
