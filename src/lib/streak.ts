import type { DayEntry } from "../data/types";
import { addDays, parseISODate, toISODate } from "./dates";

/**
 * Consecutive days with score > 0, walking back from `today`. An unfilled
 * past day counts as score 0 and breaks the streak; an unfilled `today`
 * doesn't (CONTEXT.md "Стрик" / grilling round 3).
 */
export function calculateStreak(
  entries: DayEntry[],
  habitId: string,
  today: Date
): number {
  const scoreByDate = new Map(
    entries.filter((e) => e.habitId === habitId).map((e) => [e.date, e.score])
  );

  let cursor = today;
  if (!scoreByDate.has(toISODate(today))) {
    cursor = addDays(today, -1);
  }

  let streak = 0;
  while (true) {
    const score = scoreByDate.get(toISODate(cursor)) ?? 0;
    if (score <= 0) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/**
 * Longest streak in the habit's whole recorded history, walking every
 * calendar day between its first and last entry (a gap with no entry
 * counts as 0, same rule as `calculateStreak`).
 */
export function calculateBestStreak(
  entries: DayEntry[],
  habitId: string
): number {
  const habitEntries = entries.filter((e) => e.habitId === habitId);
  if (habitEntries.length === 0) return 0;

  const scoreByDate = new Map(habitEntries.map((e) => [e.date, e.score]));
  const sortedDates = habitEntries.map((e) => e.date).sort();
  const last = parseISODate(sortedDates[sortedDates.length - 1]);

  let best = 0;
  let current = 0;
  for (
    let cursor = parseISODate(sortedDates[0]);
    cursor <= last;
    cursor = addDays(cursor, 1)
  ) {
    const score = scoreByDate.get(toISODate(cursor)) ?? 0;
    if (score > 0) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}
