import { useMemo } from "react";

import type { Habit } from "../data/types";
import { PRIORITY_ORDER } from "../data/types";

/** Priority-ordered visible list + hidden list, split out of WeekPage so
 * priority/visibility changes don't collide with day-grid changes there. */
export const useVisibleHabits = (habits: Habit[]) => {
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
};
