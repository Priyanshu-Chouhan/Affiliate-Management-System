import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-lg p-12 relative z-10 text-center animate-fade-in-up">
        <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="premium-button inline-block w-auto px-8">
          Return to Home
        </Link>
      </div>
    </div>
  );
};
