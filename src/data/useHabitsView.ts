import { useMemo, useState } from "react";
import { toISODate } from "../lib/dates";
import { buildEntriesByHabit, overallScoreForDate } from "../lib/habitsData";
import type { HabitsData } from "./types";

/**
 * Shared "today / entries-by-habit / overall score" setup consumed by both
 * WeekPage and StatsPage, so the two screens can't independently drift out
 * of sync the way the overall-score bug did before this was consolidated.
 */
export function useHabitsView(data: HabitsData) {
  const [today] = useState(() => new Date());
  const todayISO = toISODate(today);

  const entriesByHabit = useMemo(
    () => buildEntriesByHabit(data.entries),
    [data.entries]
  );

  const getOverallScoreForDate = useMemo(
    () => (date: string) =>
      overallScoreForDate(data, entriesByHabit, date, todayISO),
    [data, entriesByHabit, todayISO]
  );

  return { today, todayISO, entriesByHabit, getOverallScoreForDate };
}
