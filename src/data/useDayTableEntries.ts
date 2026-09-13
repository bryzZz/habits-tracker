import { useQueries } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";

import { isISODateInRange, toISODate } from "../lib/dates";
import { indexEntriesByHabit } from "../lib/habitsData";
import { supabaseDataStore } from "./supabaseDataStore";
import type { DateRange, DayEntry } from "./types";

const monthChunks = (from: Dayjs, to: Dayjs): DateRange[] => {
  const chunks: DateRange[] = [];
  let cursor = from.startOf("month");

  while (cursor.isSameOrBefore(to, "month")) {
    chunks.push({ start: cursor.startOf("month"), end: cursor.endOf("month") });
    cursor = cursor.add(1, "month");
  }

  return chunks;
};

/** Entries for the table's visible window, fetched in calendar-month chunks
 * sharing `useGetEntries`'s `["entries", ...]` key shape (and its cache). */
export const useDayTableEntries = (visibleRange: DateRange) => {
  const chunks = monthChunks(visibleRange.start, visibleRange.end);

  const results = useQueries({
    queries: chunks.map((range) => ({
      queryKey: ["entries", toISODate(range.start), toISODate(range.end)],
      queryFn: () => supabaseDataStore.loadEntries(range),
      select: indexEntriesByHabit,
    })),
  });

  const entriesByHabit = new Map<string, Map<string, DayEntry>>();
  const loadingRanges: DateRange[] = [];

  chunks.forEach((range, i) => {
    const data = results[i]?.data;

    if (!data) {
      loadingRanges.push(range);
      return;
    }

    for (const [habitId, byDate] of data) {
      const target = entriesByHabit.get(habitId) ?? new Map();

      for (const [date, entry] of byDate) target.set(date, entry);

      entriesByHabit.set(habitId, target);
    }
  });

  const isDateLoading = (dateISO: string): boolean =>
    loadingRanges.some((range) =>
      isISODateInRange(dateISO, toISODate(range.start), toISODate(range.end))
    );

  return { entriesByHabit, isDateLoading };
};
