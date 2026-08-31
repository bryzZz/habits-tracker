import type { Dayjs } from "dayjs";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { FC } from "react";

import type { HabitStreaks } from "../data/dataStore";
import type { DayEntry, Habit } from "../data/types";
import type { GridViewMode } from "../lib/dayGrid";
import { cn } from "../lib/utils";
import { DayGridHeader } from "./DayGridHeader";
import { HabitRow } from "./HabitRow";

interface DayGridProps {
  today: Dayjs;
  dates: Dayjs[];
  viewMode: GridViewMode;
  isDesktop: boolean;
  pageKey: string;
  pageTransitionClass: string;
  visibleHabits: Habit[];
  entriesByHabit: Map<string, Map<string, DayEntry>>;
  streaksByHabit: Map<string, HabitStreaks>;
  onCellClick: (habitId: string, date: string, target: HTMLElement) => void;
  onHide: (habitId: string) => void;
}

export const DayGrid: FC<DayGridProps> = ({
  today,
  dates,
  viewMode,
  isDesktop,
  pageKey,
  pageTransitionClass,
  visibleHabits,
  entriesByHabit,
  streaksByHabit,
  onCellClick,
  onHide,
}) => {
  const rows = (
    <AccordionPrimitive.Root
      type="multiple"
      className="flex flex-col gap-2 md:gap-1"
    >
      {visibleHabits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          streak={streaksByHabit.get(habit.id)?.currentStreak ?? 0}
          today={today}
          dates={dates}
          viewMode={viewMode}
          entriesByDate={entriesByHabit.get(habit.id)}
          onCellClick={onCellClick}
          onHide={onHide}
          pageKey={pageKey}
          pageTransitionClass={pageTransitionClass}
        />
      ))}
    </AccordionPrimitive.Root>
  );

  if (isDesktop) {
    return (
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-56 shrink-0" />

          <div
            key={pageKey}
            className={cn("min-w-0 flex-1", pageTransitionClass)}
          >
            <DayGridHeader today={today} dates={dates} />
          </div>
        </div>

        {rows}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div key={pageKey} className={pageTransitionClass}>
        <DayGridHeader today={today} dates={dates} />
      </div>

      {rows}
    </div>
  );
};
