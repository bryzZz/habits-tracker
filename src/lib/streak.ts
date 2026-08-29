import dayjs, { type Dayjs } from "dayjs";

import type { DayEntry } from "../data/types";
import { toISODate } from "./dates";

/** Consecutive days with score > 0, walking back from `today`; an unfilled
 * `today` itself doesn't break the streak (CONTEXT.md "Стрик"). */
export const calculateStreak = (
  entries: DayEntry[],
  habitId: string,
  today: Dayjs
): number => {
  const scoreByDate = new Map(
    entries.filter((e) => e.habitId === habitId).map((e) => [e.date, e.score])
  );

  let cursor = today;
  if (!scoreByDate.has(toISODate(today))) {
    cursor = today.subtract(1, "day");
  }

  let streak = 0;
  while (true) {
    const score = scoreByDate.get(toISODate(cursor)) ?? 0;
    if (score <= 0) break;
    streak += 1;
    cursor = cursor.subtract(1, "day");
  }
  return streak;
};

/** Longest streak across the habit's whole history — walks every calendar
 * day between its first and last entry; a gap counts as 0, like `calculateStreak`. */
export const calculateBestStreak = (
  entries: DayEntry[],
  habitId: string
): number => {
  const habitEntries = entries.filter((e) => e.habitId === habitId);
  if (habitEntries.length === 0) return 0;

  const scoreByDate = new Map(habitEntries.map((e) => [e.date, e.score]));
  const sortedDates = habitEntries.map((e) => e.date).sort();
  const last = dayjs(sortedDates[sortedDates.length - 1]);

  let best = 0;
  let current = 0;
  for (
    let cursor = dayjs(sortedDates[0]);
    cursor.isSameOrBefore(last, "day");
    cursor = cursor.add(1, "day")
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
};
