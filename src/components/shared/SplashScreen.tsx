import { Leaf } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-surface-bg"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-orange-primary flex items-center justify-center shadow-lg">
          <Leaf size={36} className="text-white" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-primary">
            Habit Tracker
          </h1>
          <p className="mt-1.5 text-xs tracking-[0.25em] uppercase text-text-secondary">
            Consistency beats motivation
          </p>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-orange-primary opacity-40" />
          <span className="w-2 h-2 rounded-full bg-orange-primary opacity-70" />
          <span className="w-2 h-2 rounded-full bg-orange-primary opacity-100" />
        </div>
      </div>
    </div>
  );
}
