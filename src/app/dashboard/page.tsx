'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Leaf } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import { getSession, logOut } from '@/lib/auth';
import type { Session } from '@/types/auth';

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

function LogoutDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onCancel} />
      <div
        className="sheet-panel text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
      >
        <div className="w-12 h-12 rounded-full bg-orange-light flex items-center justify-center mx-auto mb-4">
          <LogOut size={22} className="text-orange-primary" strokeWidth={1.8} />
        </div>
        <h2
          id="logout-dialog-title"
          className="font-display text-xl font-bold text-dark-primary mb-2"
        >
          Log out?
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Your streak will be right here when you return.
        </p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="flex-1 bg-orange-primary text-white font-semibold py-4
                       rounded-btn transition-opacity active:opacity-80"
            onClick={onConfirm}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

function DashboardContent() {
  const router = useRouter();
  const session = getSession() as Session;
  const [showLogout, setShowLogout] = useState(false);

  function handleLogout() {
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-primary flex items-center justify-center">
              <Leaf size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-dark-primary text-lg">
              Habit Tracker
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-text-secondary truncate max-w-[200px]">
              {session.email}
            </span>
            <button
              data-testid="auth-logout-button"
              onClick={() => setShowLogout(true)}
              className="text-sm font-medium text-text-secondary border border-border
                         px-4 py-2 rounded-full hover:bg-input-bg transition-colors whitespace-nowrap"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 pb-32">
        <div className="mb-8">
          <h1
            className="font-display text-2xl md:text-3xl font-bold text-dark-primary
                       flex items-center gap-2 flex-wrap"
          >
            {greeting()} <GreetingIcon />
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {formatDate(new Date())}
          </p>
        </div>

        <HabitList session={session} />
      </main>

      {showLogout && (
        <LogoutDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
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
