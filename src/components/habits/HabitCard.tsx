'use client';
import { useState } from 'react';
import { Pencil, Trash2, Check, Flame } from 'lucide-react';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import type { Habit } from '@/types/habit';

import {
  Droplets,
  BookOpen,
  Brain,
  Apple,
  Music,
  Bike,
  Dumbbell,
  Sunrise,
  Pencil as PencilIcon,
  Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const HABIT_ICONS: LucideIcon[] = [
  Droplets,
  BookOpen,
  Brain,
  Apple,
  Music,
  Bike,
  Dumbbell,
  Sunrise,
  PencilIcon,
  Heart,
];

interface Props {
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({
  habit,
  today,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);

  const HabitIcon = HABIT_ICONS[habit.name.charCodeAt(0) % HABIT_ICONS.length];

  return (
    <>
      <div
        data-testid={`habit-card-${slug}`}
        className={`flex items-center gap-3 p-4 rounded-card shadow-card transition-colors
            ${completed ? 'bg-orange-light' : 'bg-white'}`}
      >
        {/* Habit icon */}
        <div
          className="w-10 h-10 rounded-full bg-orange-mid/50 flex items-center
                        justify-center shrink-0"
        >
          <HabitIcon
            size={20}
            className="text-orange-primary"
            strokeWidth={1.8}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`font-body font-semibold text-base truncate
                         ${completed ? 'line-through text-text-secondary' : 'text-dark-primary'}`}
          >
            {habit.name}
          </p>
          <p
            data-testid={`habit-streak-${slug}`}
            className="text-xs text-text-secondary mt-0.5 flex items-center gap-1"
          >
            <Flame size={12} className="text-orange-primary" />
            {streak} day streak
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            data-testid={`habit-edit-${slug}`}
            aria-label={`Edit ${habit.name}`}
            onClick={() => onEdit(habit)}
            className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center
                       text-text-secondary hover:bg-orange-mid transition-colors"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>

          <button
            data-testid={`habit-delete-${slug}`}
            aria-label={`Delete ${habit.name}`}
            onClick={() => setConfirmDelete(true)}
            className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center
                       text-text-secondary hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>

          <button
            data-testid={`habit-complete-${slug}`}
            aria-label={
              completed ? `Unmark ${habit.name}` : `Complete ${habit.name}`
            }
            onClick={() => onToggle(habit.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center
                        transition-colors
                        ${
                          completed
                            ? 'bg-orange-primary text-white'
                            : 'bg-transparent border-2 border-border text-transparent'
                        }`}
          >
            <Check size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <>
          <div
            className="sheet-backdrop"
            onClick={() => setConfirmDelete(false)}
          />
          <div
            className="sheet-panel text-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-delete" strokeWidth={1.8} />
            </div>
            <h2
              id="delete-dialog-title"
              className="font-display text-xl font-bold text-dark-primary mb-2"
            >
              Delete habit?
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              "{habit.name}" and all its history will be permanently removed.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-ghost flex-1"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-button"
                className="flex-1 bg-delete text-white font-semibold py-4 rounded-btn
                           transition-opacity active:opacity-80"
                onClick={() => {
                  onDelete(habit.id);
                  setConfirmDelete(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
