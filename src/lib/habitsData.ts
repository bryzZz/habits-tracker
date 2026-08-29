import type { DayEntry, Habit } from "../data/types";
import { PRIORITY_ORDER } from "../data/types";

export const splitHabitsByVisibility = (
  habits: Habit[]
): { visibleHabits: Habit[]; hiddenHabits: Habit[] } => {
  return {
    visibleHabits: PRIORITY_ORDER.flatMap((priority) =>
      habits.filter((h) => h.visible && h.priority === priority)
    ),
    hiddenHabits: habits.filter((h) => !h.visible),
  };
};

export const upsertEntry = (
  entries: DayEntry[],
  entry: DayEntry
): DayEntry[] => {
  const idx = entries.findIndex(
    (e) => e.habitId === entry.habitId && e.date === entry.date
  );
  if (idx < 0) return [...entries, entry];
  return entries.map((e, i) => (i === idx ? entry : e));
};

export const setHabitVisibility = (
  habits: Habit[],
  habitId: string,
  visible: boolean
): Habit[] => {
  return habits.map((h) => (h.id === habitId ? { ...h, visible } : h));
};

/** Average score across visible habits for one date; unfilled past days count
 * as 0 (CONTEXT.md "Запись дня"), future dates have no meaningful average. */
export const overallScoreForDate = (
  habits: Habit[],
  entriesByHabit: Map<string, Map<string, DayEntry>>,
  date: string,
  todayISO: string
): number | undefined => {
  if (date > todayISO) return undefined;

  const visibleHabits = habits.filter((h) => h.visible);

  if (visibleHabits.length === 0) return undefined;

  const scores = visibleHabits.map(
    (h) => entriesByHabit.get(h.id)?.get(date)?.score ?? 0
  );

  return scores.reduce((a, b) => a + b, 0) / scores.length;
};
