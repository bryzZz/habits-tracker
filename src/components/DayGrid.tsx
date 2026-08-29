import type { Dayjs } from "dayjs";
import type { Dispatch, FC, SetStateAction } from "react";

import type { HabitStreaks } from "../data/dataStore";
import type { DayEntry, Habit } from "../data/types";
import { useSwipeNavigate } from "../hooks/useSwipeNavigate";
import { formatMonthYear, formatWeekRange, toISODate } from "../lib/dates";
import type { GridViewMode } from "../lib/dayGrid";
import { cn } from "../lib/utils";
import { DayGridHeader } from "./DayGridHeader";
import { DayGridToolbar } from "./DayGridToolbar";
import { HabitDayCells } from "./HabitDayCells";
import { HabitNameCell } from "./HabitNameCell";

interface DayGridProps {
  today: Dayjs;
  dates: Dayjs[];
  viewMode: GridViewMode;
  setViewMode: Dispatch<SetStateAction<GridViewMode>>;
  isDesktop: boolean;
  pageStart: Dayjs;
  isOnToday: boolean;
  direction: -1 | 1;
  navigate: (direction: -1 | 1) => void;
  goToToday: () => void;
  visibleHabits: Habit[];
  entriesByHabit: Map<string, Map<string, DayEntry>>;
  streaksByHabit: Map<string, HabitStreaks>;
  overallScore: number | null;
  onCellClick: (habitId: string, date: string, target: HTMLElement) => void;
  onHide: (habitId: string) => void;
}

export const DayGrid: FC<DayGridProps> = ({
  today,
  dates,
  viewMode,
  setViewMode,
  isDesktop,
  pageStart,
  isOnToday,
  direction,
  navigate,
  goToToday,
  visibleHabits,
  entriesByHabit,
  streaksByHabit,
  overallScore,
  onCellClick,
  onHide,
}) => {
  const swipeHandlers = useSwipeNavigate(navigate);

  const rangeLabel =
    viewMode === "week"
      ? formatWeekRange(pageStart, dates.length)
      : formatMonthYear(pageStart);

  const scoreLabel =
    viewMode === "month"
      ? "Средний балл месяца"
      : isDesktop
        ? "Средний балл за 2 недели"
        : "Средний балл недели";

  const pageKey = `${viewMode}-${toISODate(pageStart)}`;
  const pageTransitionClass = cn(
    "animate-in fade-in-0 duration-150",
    direction === 1 ? "slide-in-from-right-3" : "slide-in-from-left-3"
  );

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

  return (
    <>
      <DayGridToolbar
        rangeLabel={rangeLabel}
        scoreLabel={scoreLabel}
        overallScore={overallScore}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOnToday={isOnToday}
        navigate={navigate}
        goToToday={goToToday}
        pageKey={pageKey}
        pageTransitionClass={pageTransitionClass}
      />

      {isDesktop ? (
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
      ) : (
        <div className="flex flex-col" {...swipeHandlers}>
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
      )}
    </>
  );
};
