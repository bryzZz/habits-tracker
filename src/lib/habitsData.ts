import type { DayEntry, HabitsData } from "../data/types";

export function entryFor(
  data: HabitsData,
  habitId: string,
  date: string
): DayEntry | undefined {
  return data.entries.find((e) => e.habitId === habitId && e.date === date);
}

export function upsertEntry(data: HabitsData, entry: DayEntry): HabitsData {
  const idx = data.entries.findIndex(
    (e) => e.habitId === entry.habitId && e.date === entry.date
  );
  const entries =
    idx >= 0
      ? data.entries.map((e, i) => (i === idx ? entry : e))
      : [...data.entries, entry];
  return { ...data, entries };
}

export function setHabitVisibility(
  data: HabitsData,
  habitId: string,
  visible: boolean
): HabitsData {
  return {
    ...data,
    habits: data.habits.map((h) => (h.id === habitId ? { ...h, visible } : h)),
  };
}

export function buildEntriesByHabit(
  entries: DayEntry[]
): Map<string, Map<string, DayEntry>> {
  const map = new Map<string, Map<string, DayEntry>>();
  for (const entry of entries) {
    if (!map.has(entry.habitId)) map.set(entry.habitId, new Map());
    map.get(entry.habitId)!.set(entry.date, entry);
  }
  return map;
}

/**
 * Average score across all visible habits for one date. An unfilled past
 * day counts as 0 for every visible habit (CONTEXT.md "Запись дня" — same
 * rule as streaks, applied consistently to this aggregate too). Future
 * dates have no meaningful average yet.
 */
export function overallScoreForDate(
  data: HabitsData,
  entriesByHabit: Map<string, Map<string, DayEntry>>,
  date: string,
  todayISO: string
): number | undefined {
  if (date > todayISO) return undefined;
  const visibleHabits = data.habits.filter((h) => h.visible);
  if (visibleHabits.length === 0) return undefined;
  const scores = visibleHabits.map(
    (h) => entriesByHabit.get(h.id)?.get(date)?.score ?? 0
  );
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
