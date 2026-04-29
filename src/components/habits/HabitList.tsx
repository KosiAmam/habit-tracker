'use client';
import { useState, useSyncExternalStore, useRef } from 'react';
import { Plus, Sprout } from 'lucide-react';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { getHabits, HABIT_CHANGE_EVENT } from '@/lib/storage';
import {
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion,
} from '@/lib/habits';
import type { Habit } from '@/types/habit';
import type { Session } from '@/types/auth';

function makeStore() {
  let cache = '[]';
  let snapshot: Habit[] = [];

  function getSnapshot(): Habit[] {
    const raw = localStorage.getItem('habit-tracker-habits') ?? '[]';
    if (raw !== cache) {
      cache = raw;
      snapshot = JSON.parse(raw) as Habit[];
    }
    return snapshot;
  }

  function subscribe(cb: () => void) {
    window.addEventListener(HABIT_CHANGE_EVENT, cb);
    window.addEventListener('storage', cb);
    return () => {
      window.removeEventListener(HABIT_CHANGE_EVENT, cb);
      window.removeEventListener('storage', cb);
    };
  }

  return { getSnapshot, subscribe };
}

const habitStore = makeStore();

interface Props {
  session: Session;
}

export default function HabitList({ session }: Props) {
  const allHabits = useSyncExternalStore(
    habitStore.subscribe,
    habitStore.getSnapshot,
    () => []
  );
  const habits = allHabits.filter((h) => h.userId === session.userId);
  const today = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined
  );

  function handleCreate(name: string, desc: string) {
    createHabit(session.userId, name, desc);
    setShowForm(false);
  }

  function handleUpdate(name: string, desc: string) {
    if (!editingHabit) return;
    updateHabit(editingHabit.id, { name, description: desc });
    setEditingHabit(undefined);
  }

  const handleDelete = (id: string) => deleteHabit(id);
  const handleToggle = (id: string) => toggleCompletion(id, today);

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body font-semibold text-lg text-dark-primary">
            Daily routine
          </h2>
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="text-orange-primary font-semibold text-sm"
            aria-label="Add new habit"
          >
            + New
          </button>
        </div>

        {habits.length === 0 ? (
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center py-20 text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-orange-light flex items-center justify-center">
              <Sprout
                size={30}
                className="text-orange-primary"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-dark-primary">
                No habits yet
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Start building your daily routine.
                <br />
                Add your first habit below.
              </p>
            </div>
            <button
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="btn-primary max-w-xs"
            >
              + Add first habit
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggle={handleToggle}
                onEdit={(h) => setEditingHabit(h)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAB — inset from edges, won't overflow on any screen */}
      {habits.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          aria-label="Add habit"
          className="fixed bottom-24 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14
               rounded-full bg-dark-primary text-white flex items-center
               justify-center shadow-fab transition-transform active:scale-95 z-20"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      )}

      {showForm && (
        <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editingHabit && (
        <HabitForm
          habit={editingHabit}
          onSave={handleUpdate}
          onCancel={() => setEditingHabit(undefined)}
        />
      )}
    </>
  );
}
