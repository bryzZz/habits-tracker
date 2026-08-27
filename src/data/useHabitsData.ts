import { useCallback, useEffect, useRef, useState } from "react";

import { setHabitVisibility, upsertEntry } from "../lib/habitsData";
import type { DataStore } from "./dataStore";
import type { DayEntry, HabitsData } from "./types";

export const useHabitsData = (store: DataStore) => {
  const [data, setData] = useState<HabitsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<HabitsData | null>(null);

  // Kept outside setData's updater — StrictMode double-invokes functional
  // updaters in dev, which would double-fire store.save() otherwise.
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

  return { data, error, saveEntry, toggleHabitVisibility };
};
