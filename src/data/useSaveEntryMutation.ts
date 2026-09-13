import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { isISODateInRange } from "../lib/dates";
import { upsertEntry } from "../lib/habitsData";
import { supabaseDataStore } from "./supabaseDataStore";
import type { DayEntry } from "./types";

/** Matches any cached `["entries", startISO, endISO]` query covering `date` —
 * the grid's one fixed range, or any of the table's several chunk queries. */
const entriesQueryCoversDate = (queryKey: QueryKey, date: string): boolean => {
  const [key, startISO, endISO] = queryKey;
  return (
    key === "entries" &&
    typeof startISO === "string" &&
    typeof endISO === "string" &&
    isISODateInRange(date, startISO, endISO)
  );
};

export const useSaveEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: DayEntry) => supabaseDataStore.saveEntry(entry),
    onMutate: (entry) => {
      queryClient.setQueriesData<DayEntry[]>(
        {
          queryKey: ["entries"],
          predicate: (query) =>
            entriesQueryCoversDate(query.queryKey, entry.date),
        },
        (prev) => (prev ? upsertEntry(prev, entry) : prev)
      );
    },
    onSuccess: (_data, entry) => {
      queryClient.invalidateQueries({ queryKey: ["streaks", entry.habitId] });
    },
    onError: (err: unknown) => console.error(err),
  });
};
