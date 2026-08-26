import { useMemo } from "react";

import type { Habit } from "../data/types";
import { PRIORITY_ORDER } from "../data/types";

/** Splits habits into the flat, priority-ordered visible list and the hidden list, isolated from WeekPage so priority/visibility ordering changes don't land in the same file as day-grid changes. */
export function useVisibleHabits(habits: Habit[]) {
  const visibleHabits = useMemo(
    () =>
      PRIORITY_ORDER.flatMap((priority) =>
        habits.filter((h) => h.visible && h.priority === priority)
      ),
    [habits]
  );

  const hiddenHabits = useMemo(
    () => habits.filter((h) => !h.visible),
    [habits]
  );

  return { visibleHabits, hiddenHabits };
}
