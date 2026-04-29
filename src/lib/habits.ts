import { v4 as uuid } from 'uuid';
import { getHabits, saveHabits } from './storage';
import type { Habit } from '@/types/habit';

export { getHabits };

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const has = habit.completions.includes(date);
  const completions = has
    ? habit.completions.filter((d) => d !== date)
    : [...new Set([...habit.completions, date])];
  return { ...habit, completions };
}

export function createHabit(
  userId: string,
  name: string,
  description: string
): Habit {
  const habit: Habit = {
    id: uuid(),
    userId,
    name,
    description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };
  saveHabits([...getHabits(), habit]);
  return habit;
}

export function updateHabit(
  id: string,
  patch: Pick<Habit, 'name' | 'description'>
): Habit | null {
  const habits = getHabits();
  const idx = habits.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const updated = { ...habits[idx], ...patch };
  habits[idx] = updated;
  saveHabits(habits);
  return updated;
}

export function deleteHabit(id: string): void {
  saveHabits(getHabits().filter((h) => h.id !== id));
}

export function toggleCompletion(id: string, date: string): Habit | null {
  const habits = getHabits();
  const idx = habits.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const updated = toggleHabitCompletion(habits[idx], date);
  habits[idx] = updated;
  saveHabits(habits);
  return updated;
}
