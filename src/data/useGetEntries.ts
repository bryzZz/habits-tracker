import { useQuery } from "@tanstack/react-query";

import { toISODate } from "../lib/dates";
import { indexEntriesByHabit } from "../lib/habitsData";
import { supabaseDataStore } from "./supabaseDataStore";
import type { DateRange } from "./types";

/** Entries for one date range (ADR-0012: windowed), pre-indexed by habit and
 * date via `select` — every consumer wants that shape. */
export const useGetEntries = (dateRange: DateRange) =>
  useQuery({
    queryKey: ["entries", toISODate(dateRange.start), toISODate(dateRange.end)],
    queryFn: () => supabaseDataStore.loadEntries(dateRange),
    select: indexEntriesByHabit,
  });
