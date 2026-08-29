import { useQueries } from "@tanstack/react-query";

import type { HabitStreaks } from "./dataStore";
import { supabaseDataStore } from "./supabaseDataStore";

/** Current/best streak per habit (ADR-0012's RPC), keyed for O(1) lookup —
 * one `useQueries` call rather than N separate hook calls. */
export const useGetHabitStreaks = (habitIds: string[]) => {
  const results = useQueries({
    queries: habitIds.map((habitId) => ({
      queryKey: ["streaks", habitId],
      queryFn: () => supabaseDataStore.loadStreaks(habitId),
    })),
  });

  const streaksByHabitId = new Map<string, HabitStreaks>();

  habitIds.forEach((habitId, i) => {
    const data = results[i]?.data;

    if (data) streaksByHabitId.set(habitId, data);
  });

  return streaksByHabitId;
};
