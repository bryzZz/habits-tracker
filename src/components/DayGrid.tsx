import type { Dayjs } from "dayjs";
import type { FC } from "react";

import type { HabitStreaks } from "../data/dataStore";
import type { DayEntry, Habit } from "../data/types";
import type { GridViewMode } from "../lib/dayGrid";
import { cn } from "../lib/utils";
import { DayGridHeader } from "./DayGridHeader";
import { HabitDayCells } from "./HabitDayCells";
import { HabitNameCell } from "./HabitNameCell";

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
  const nameCell = (habit: Habit) => (
    <HabitNameCell
      key={`${habit.id}-name`}
      habit={habit}
      streak={streaksByHabit.get(habit.id)?.currentStreak ?? 0}
      onHide={onHide}
    />
  );

  const dayCells = (habit: Habit) => (
    <HabitDayCells
      key={`${habit.id}-cells`}
      habitId={habit.id}
      today={today}
      dates={dates}
      size={viewMode}
      entriesByDate={entriesByHabit.get(habit.id)}
      onCellClick={onCellClick}
    />
  );

  if (isDesktop) {
    return (
      <div className="flex gap-4">
        <div className="flex w-56 shrink-0 flex-col">
          <div className="mb-4.5 h-12" />

          <div className="flex flex-col gap-1">
            {visibleHabits.map(nameCell)}
          </div>
        </div>

        <div
          key={pageKey}
          className={cn("min-w-0 flex-1", pageTransitionClass)}
        >
          <DayGridHeader today={today} dates={dates} />

          <div className="flex flex-col gap-1">
            {visibleHabits.map(dayCells)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div key={pageKey} className={pageTransitionClass}>
        <DayGridHeader today={today} dates={dates} />
      </div>

      <div className="flex flex-col gap-2">
        {visibleHabits.map((habit) => (
          <div key={habit.id} className="flex flex-col gap-1.5">
            {nameCell(habit)}

            <div key={pageKey} className={pageTransitionClass}>
              {dayCells(habit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
