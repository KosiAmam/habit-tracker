export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  const todayStr = today ?? new Date().toISOString().slice(0, 10);

  // de-dupe and sort descending
  const days = [...new Set(completions)].sort((a, b) => (a > b ? -1 : 1));

  if (!days.includes(todayStr)) return 0;

  let streak = 0;
  let cursor = todayStr;

  for (const day of days) {
    if (day === cursor) {
      streak++;
      // step cursor back one calendar day
      const d = new Date(cursor + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    } else if (day < cursor) {
      break; // gap found
    }
  }

  return streak;
}
