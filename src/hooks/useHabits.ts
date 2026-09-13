import type { DateRange, DayEntry } from "@/data/types";
import { useGetEntries } from "@/data/useGetEntries";
import { useGetHabits } from "@/data/useGetHabits";
import { useGetHabitStreaks } from "@/data/useGetHabitStreaks";
import { useHabitVisibilityMutation } from "@/data/useHabitVisibilityMutation";
import { useSaveEntryMutation } from "@/data/useSaveEntryMutation";
import { splitHabitsByVisibility } from "@/lib/habitsData";

export const useHabits = (dateRange: DateRange) => {
  const {
    data: habits = [],
    isLoading: habitsLoading,
    error: habitsError,
  } = useGetHabits();

  const {
    data: entriesByHabit = new Map<string, Map<string, DayEntry>>(),
    isLoading: entriesLoading,
    error: entriesError,
  } = useGetEntries(dateRange);

  const { mutate: saveEntry } = useSaveEntryMutation();

  const { mutate: mutateVisibility } = useHabitVisibilityMutation();

  const { visibleHabits, hiddenHabits } = splitHabitsByVisibility(habits);

  const streaksByHabitId = useGetHabitStreaks(visibleHabits.map((h) => h.id));

  const allScores = visibleHabits.flatMap((h) => {
    if (!entriesByHabit.has(h.id)) return [];

    return [...entriesByHabit.get(h.id)!.values()].map((e) => e.score);
  });
  const overallScore =
    allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : null;

  const handleSaveEntry = (entry: DayEntry) => {
    saveEntry(entry);
  };

  const handleHideHabit = (habitId: string) => {
    mutateVisibility({ habitId, visible: false });
  };

  const handleShowHabit = (habitId: string) => {
    mutateVisibility({ habitId, visible: true });
  };

  return {
    visibleHabits,
    hiddenHabits,
    habitsLoading,
    habitsError,
    entriesByHabit,
    entriesLoading,
    entriesError,
    handleSaveEntry,
    handleHideHabit,
    handleShowHabit,
    streaksByHabitId,
    overallScore,
  };
};
