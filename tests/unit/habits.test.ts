import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';

const BASE: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2026-01-01T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(BASE, '2026-04-27');
    expect(result.completions).toContain('2026-04-27');
    expect(result.completions).toHaveLength(1);
  });

  it('removes a completion date when the date already exists', () => {
    const habit = { ...BASE, completions: ['2026-04-27'] };
    const result = toggleHabitCompletion(habit, '2026-04-27');
    expect(result.completions).not.toContain('2026-04-27');
    expect(result.completions).toHaveLength(0);
  });

  it('does not mutate the original habit object', () => {
    const habit = { ...BASE, completions: [] };
    toggleHabitCompletion(habit, '2026-04-27');
    expect(habit.completions).toHaveLength(0);
    expect(habit.completions).not.toContain('2026-04-27');
  });

  it('does not return duplicate completion dates', () => {
    // Even if input somehow has dupes, output must be clean
    const habit = { ...BASE, completions: ['2026-04-26', '2026-04-26'] };
    const result = toggleHabitCompletion(habit, '2026-04-27');
    const unique = [...new Set(result.completions)];
    expect(result.completions).toHaveLength(unique.length);
  });
});
