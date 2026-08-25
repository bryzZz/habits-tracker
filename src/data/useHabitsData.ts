import { useCallback, useEffect, useRef, useState } from "react";
import { setHabitVisibility, upsertEntry } from "../lib/habitsData";
import type { DataStore } from "./dataStore";
import type { DayEntry, HabitsData } from "./types";

export function useHabitsData(store: DataStore) {
  const [data, setData] = useState<HabitsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<HabitsData | null>(null);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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

  // Persists outside setData's updater — React StrictMode double-invokes
  // functional setState updaters in dev, which would otherwise fire two
  // concurrent store.save() calls per mutation and race the local file API.
  const persist = useCallback(
    (next: HabitsData) => {
      setData(next);
      store.save(next).catch((err: unknown) => setError(String(err)));
    },
    [store]
  );

  const saveEntry = useCallback(
    (entry: DayEntry) => {
      const prev = dataRef.current;
      if (!prev) return;
      persist(upsertEntry(prev, entry));
    },
    [persist]
  );

  const toggleHabitVisibility = useCallback(
    (habitId: string, visible: boolean) => {
      const prev = dataRef.current;
      if (!prev) return;
      persist(setHabitVisibility(prev, habitId, visible));
    },
    [persist]
  );

  return { data, error, saveEntry, toggleHabitVisibility };
}
