import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { buildEntriesByHabit, overallScoreForDate } from "../lib/habitsData";
import type { HabitsData } from "./types";

/** Shared today/entries/overall-score setup for WeekPage and StatsPage, so
 * the two screens can't drift out of sync again. */
export const useHabitsView = (data: HabitsData) => {
  const [today] = useState(() => dayjs());
  const todayISO = today.format("YYYY-MM-DD");

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
};
