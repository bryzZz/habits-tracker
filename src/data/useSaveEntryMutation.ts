import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toISODate } from "../lib/dates";
import { upsertEntry } from "../lib/habitsData";
import { supabaseDataStore } from "./supabaseDataStore";
import type { DateRange, DayEntry } from "./types";

/** Saves within the same `[start, end]` window `useGetEntries` was called
 * with, so the optimistic update patches the right cache entry. */
export const useSaveEntryMutation = (dateRange: DateRange) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: DayEntry) => supabaseDataStore.saveEntry(entry),
    onMutate: (entry) => {
      queryClient.setQueryData<DayEntry[]>(
        ["entries", toISODate(dateRange.start), toISODate(dateRange.end)],
        (prev) => (prev ? upsertEntry(prev, entry) : prev)
      );
    },
    onSuccess: (_data, entry) => {
      queryClient.invalidateQueries({ queryKey: ["streaks", entry.habitId] });
    },
    onError: (err: unknown) => console.error(err),
  });
};
