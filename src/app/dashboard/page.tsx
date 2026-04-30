'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Leaf } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import { getSession, logOut } from '@/lib/auth';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function GreetingIcon() {
  const h = new Date().getHours();
  if (h < 12) return <span className="text-2xl">☀️</span>;
  if (h < 18) return <span className="text-2xl">🌤️</span>;
  return <span className="text-2xl">🌙</span>;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DashboardContent() {
  const router = useRouter();

  const session = getSession();

  // ✅ TypeScript safety fix
  if (!session) return null;

  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogoutConfirm() {
    logOut();
    router.replace('/login');
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-surface-bg overflow-x-hidden"
    >
      {/* Nav */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-primary flex items-center justify-center">
              <Leaf size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-dark-primary text-lg">
              Habit Tracker
            </span>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-text-secondary truncate max-w-[200px]">
              {session.email}
            </span>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm font-medium text-text-secondary border border-border
                           px-4 py-2 rounded-full hover:bg-input-bg transition-colors whitespace-nowrap"
              >
                Log out
              </button>
            ) : (
              <button
                data-testid="auth-logout-button"
                onClick={handleLogoutConfirm}
                className="text-sm font-medium text-red-600 border border-red-300
                           px-4 py-2 rounded-full hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                Confirm logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 pb-32">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark-primary flex items-center gap-2 flex-wrap">
            {greeting()} <GreetingIcon />
          </h1>

          <p className="text-text-secondary text-sm mt-1">
            {formatDate(new Date())}
          </p>
        </div>

        <HabitList session={session} />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
