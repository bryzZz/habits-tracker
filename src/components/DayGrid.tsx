import type { Dayjs } from "dayjs";
import type { FC } from "react";
import { useMemo } from "react";

import type { DayEntry, Habit } from "../data/types";
import { useDayGrid } from "../hooks/useDayGrid";
import { useSwipeNavigate } from "../hooks/useSwipeNavigate";
import { formatMonthYear, formatWeekRange } from "../lib/dates";
import { calculateStreak } from "../lib/streak";
import { cn } from "../lib/utils";
import { DayGridHeader } from "./DayGridHeader";
import { DayGridToolbar } from "./DayGridToolbar";
import { HabitDayCells } from "./HabitDayCells";
import { HabitNameCell } from "./HabitNameCell";

interface DayGridProps {
  today: Dayjs;
  entries: DayEntry[];
  visibleHabits: Habit[];
  entriesByHabit: Map<string, Map<string, DayEntry>>;
  getOverallScoreForDate: (date: string) => number | undefined;
  onCellClick: (habitId: string, date: string, target: HTMLElement) => void;
  onHide: (habitId: string) => void;
}

export const DayGrid: FC<DayGridProps> = ({
  today,
  entries,
  visibleHabits,
  entriesByHabit,
  getOverallScoreForDate,
  onCellClick,
  onHide,
}) => {
  const {
    viewMode,
    setViewMode,
    isDesktop,
    layout,
    pageStart,
    isOnToday,
    direction,
    navigate,
    goToToday,
  } = useDayGrid(today);
  const swipeHandlers = useSwipeNavigate(navigate);

  const overallScore = useMemo(() => {
    const daily = layout.dates
      .map((date) => getOverallScoreForDate(date))
      .filter((s): s is number => s !== undefined);
    if (daily.length === 0) return null;
    return daily.reduce((a, b) => a + b, 0) / daily.length;
  }, [layout.dates, getOverallScoreForDate]);

  const rangeLabel =
    viewMode === "week"
      ? formatWeekRange(pageStart, layout.dates.length)
      : formatMonthYear(pageStart);

  const scoreLabel =
    viewMode === "month"
      ? "Средний балл месяца"
      : isDesktop
        ? "Средний балл за 2 недели"
        : "Средний балл недели";

  const pageKey = `${viewMode}-${pageStart.format("YYYY-MM-DD")}`;
  const pageTransitionClass = cn(
    "animate-in fade-in-0 duration-150",
    direction === 1 ? "slide-in-from-right-3" : "slide-in-from-left-3"
  );

  const nameCell = (habit: Habit) => (
    <HabitNameCell
      key={`${habit.id}-name`}
      habit={habit}
      streak={calculateStreak(entries, habit.id, today)}
      onHide={onHide}
    />
  );

  const dayCells = (habit: Habit) => (
    <HabitDayCells
      key={`${habit.id}-cells`}
      habitId={habit.id}
      layout={layout}
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
            <DayGridHeader layout={layout} />

            <div className="flex flex-col gap-1">
              {visibleHabits.map(dayCells)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col" {...swipeHandlers}>
          <div key={pageKey} className={pageTransitionClass}>
            <DayGridHeader layout={layout} />
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
