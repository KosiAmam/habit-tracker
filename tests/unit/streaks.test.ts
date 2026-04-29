import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

const TODAY = '2026-04-27';
const YESTERDAY = '2026-04-26';
const TWO_AGO = '2026-04-25';
const THREE_AGO = '2026-04-24';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([YESTERDAY], TODAY)).toBe(0);
    expect(calculateCurrentStreak([YESTERDAY, TWO_AGO], TODAY)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([TODAY], TODAY)).toBe(1);
    expect(calculateCurrentStreak([TODAY, YESTERDAY], TODAY)).toBe(2);
    expect(calculateCurrentStreak([TODAY, YESTERDAY, TWO_AGO], TODAY)).toBe(3);
    expect(
      calculateCurrentStreak([TODAY, YESTERDAY, TWO_AGO, THREE_AGO], TODAY)
    ).toBe(4);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([TODAY, TODAY], TODAY)).toBe(1);
    expect(
      calculateCurrentStreak([TODAY, TODAY, YESTERDAY, YESTERDAY], TODAY)
    ).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak([TODAY, TWO_AGO], TODAY)).toBe(1);
    expect(calculateCurrentStreak([TODAY, YESTERDAY, THREE_AGO], TODAY)).toBe(
      2
    );
  });
});
