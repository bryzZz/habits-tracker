import { useCallback, useEffect, useState } from "react";
import { setHabitVisibility, upsertEntry } from "../lib/habitsData";
import type { DataStore } from "./dataStore";
import type { DayEntry, HabitsData } from "./types";

export function useHabitsData(store: DataStore) {
  const [data, setData] = useState<HabitsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .load()
      .then((loaded) => {
        if (!cancelled) setData(loaded);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const saveEntry = useCallback(
    (entry: DayEntry) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = upsertEntry(prev, entry);
        store.save(next).catch((err: unknown) => setError(String(err)));
        return next;
      });
    },
    [store]
  );

  const toggleHabitVisibility = useCallback(
    (habitId: string, visible: boolean) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = setHabitVisibility(prev, habitId, visible);
        store.save(next).catch((err: unknown) => setError(String(err)));
        return next;
      });
    },
    [store]
  );

  return { data, error, saveEntry, toggleHabitVisibility };
}
