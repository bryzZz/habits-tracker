import { useQuery } from "@tanstack/react-query";

import { toISODate } from "../lib/dates";
import { supabaseDataStore } from "./supabaseDataStore";
import type { DateRange, DayEntry } from "./types";

/** Entries for one date range (ADR-0012: windowed), pre-indexed by habit and
 * date — every consumer wants that shape, so the mapping lives in `select`. */
export const useGetEntries = (dateRange: DateRange) =>
  useQuery({
    queryKey: ["entries", toISODate(dateRange.start), toISODate(dateRange.end)],
    queryFn: () => supabaseDataStore.loadEntries(dateRange),
    select: (entries) => {
      const map = new Map<string, Map<string, DayEntry>>();

      for (const entry of entries) {
        if (!map.has(entry.habitId)) {
          map.set(entry.habitId, new Map());
        }

        map.get(entry.habitId)!.set(entry.date, entry);
      }

      return map;
    },
  });
