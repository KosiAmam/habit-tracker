import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('Read Books')).toBe('read-books');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Morning   Run  ')).toBe('morning-run');
    expect(getHabitSlug('  Go   To   Gym  ')).toBe('go-to-gym');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Push-ups & Planks!')).toBe('push-ups-planks');
    expect(getHabitSlug('Drink Water (2L/day)')).toBe('drink-water-2lday');
  });
});
