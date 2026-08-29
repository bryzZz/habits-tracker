import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { useGetEntries } from "@/data/useGetEntries";
import { useGetHabits } from "@/data/useGetHabits";
import { useGetHabitStreaks } from "@/data/useGetHabitStreaks";
import { monthGridWeeks, toISODate } from "@/lib/dates";
import { overallScoreForDate } from "@/lib/habitsData";

type Period = "week" | "month";

export const useStats = () => {
  const [today] = useState(() => dayjs());
  const [period, setPeriod] = useState<Period>("month");
  const [selectedHabitId, setSelectedHabitId] = useState("");

  const {
    data: habits = [],
    isLoading: habitsLoading,
    error: habitsError,
  } = useGetHabits();

  // Padded a week past each end so one range covers both the month heatmap
  // and either period's trend (ADR-0012: entries are windowed).
  const {
    data: entriesByHabit,
    isLoading: entriesLoading,
    error: entriesError,
  } = useGetEntries({
    start: today.startOf("month").subtract(7, "day"),
    end: today.endOf("month").add(7, "day"),
  });

  // Falls back to the first habit once habits load, without a setState-in-
  // effect round trip — see https://react.dev/learn/you-might-not-need-an-effect.
  // Feeds useGetHabitStreaks below, so it can't move after all hook calls.
  const effectiveHabitId = selectedHabitId || (habits[0]?.id ?? "");

  const streaksByHabitId = useGetHabitStreaks(
    effectiveHabitId ? [effectiveHabitId] : []
  );

  const monthWeeks = useMemo(() => monthGridWeeks(today), [today]);
  const { currentStreak = 0, bestStreak = 0 } =
    streaksByHabitId.get(effectiveHabitId) ?? {};

  const overallByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const week of monthWeeks) {
      for (const d of week) {
        if (!d.isSame(today, "month")) continue;
        const iso = toISODate(d);
        const score = overallScoreForDate(
          habits,
          entriesByHabit ?? new Map(),
          iso,
          toISODate(today)
        );
        if (score !== undefined) map.set(iso, score);
      }
    }
    return map;
  }, [monthWeeks, today, habits, entriesByHabit]);

  const selectedHabit = habits.find((h) => h.id === effectiveHabitId);

  const trendPoints = useMemo(() => {
    if (!selectedHabit) return [];
    const byDate = entriesByHabit?.get(selectedHabit.id);
    const rangeDates =
      period === "month"
        ? monthWeeks
            .flat()
            .filter((d) => d.isSame(today, "month"))
            .map((d) => toISODate(d))
        : Array.from({ length: 7 }, (_, i) =>
            toISODate(today.startOf("week").add(i, "day"))
          );

    return rangeDates
      .filter((date) => dayjs(date).isSameOrBefore(today, "day"))
      .map((date) => ({ date, score: byDate?.get(date)?.score }))
      .filter(
        (p): p is { date: string; score: number } => p.score !== undefined
      );
  }, [selectedHabit, entriesByHabit, period, monthWeeks, today]);

  const periodAvg =
    trendPoints.length > 0
      ? trendPoints.reduce((a, p) => a + p.score, 0) / trendPoints.length
      : null;

  return {
    today,
    period,
    setPeriod,
    habits,
    habitsLoading,
    habitsError,
    entriesLoading,
    entriesError,
    effectiveHabitId,
    setSelectedHabitId,
    currentStreak,
    bestStreak,
    overallByDate,
    selectedHabit,
    trendPoints,
    periodAvg,
  };
};
