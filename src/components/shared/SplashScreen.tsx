import { Leaf } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-bg"
    >
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-orange-primary flex items-center justify-center shadow-lg">
          <Leaf size={36} className="text-white" strokeWidth={1.8} />
        </div>

        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-primary tracking-tight">
            Habit Tracker
          </h1>
          <p className="mt-1.5 text-xs tracking-[0.25em] uppercase text-text-secondary font-body">
            Consistency beats motivation
          </p>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <span
            className="w-2 h-2 rounded-full bg-orange-primary"
            style={{
              animation: 'splash-bounce 1.2s ease-in-out infinite',
              animationDelay: '0ms',
            }}
          />
          <span
            className="w-2 h-2 rounded-full bg-orange-primary"
            style={{
              animation: 'splash-bounce 1.2s ease-in-out infinite',
              animationDelay: '200ms',
            }}
          />
          <span
            className="w-2 h-2 rounded-full bg-orange-primary"
            style={{
              animation: 'splash-bounce 1.2s ease-in-out infinite',
              animationDelay: '400ms',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-bounce {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
