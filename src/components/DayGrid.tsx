import type { Dayjs } from "dayjs";
import type { FC } from "react";
import { useMemo } from "react";

import type { DayEntry, Habit } from "../data/types";
import { useDayGrid } from "../hooks/useDayGrid";
import { formatMonthYear, formatWeekRange } from "../lib/dates";
import { datesInBlock } from "../lib/dayGrid";
import { calculateStreak } from "../lib/streak";
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

/** Isolates useDayGrid's ~120 scroll-driven re-renders/sec here, away from
 * WeekPage (which also renders the entry popup and hidden-habits accordion). */
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
    scrollRef,
    layout,
    currentBlockStart,
    navigate,
    goToToday,
  } = useDayGrid(today);

  const currentBlockDates = useMemo(
    () => datesInBlock(viewMode, currentBlockStart),
    [viewMode, currentBlockStart]
  );

  const overallScore = useMemo(() => {
    const daily = currentBlockDates
      .map((date) => getOverallScoreForDate(date))
      .filter((s): s is number => s !== undefined);
    if (daily.length === 0) return null;
    return daily.reduce((a, b) => a + b, 0) / daily.length;
  }, [currentBlockDates, getOverallScoreForDate]);

  const rangeLabel =
    viewMode === "week"
      ? formatWeekRange(currentBlockStart)
      : formatMonthYear(currentBlockStart);

  return (
    <>
      <DayGridToolbar
        rangeLabel={rangeLabel}
        overallScore={overallScore}
        viewMode={viewMode}
        setViewMode={setViewMode}
        navigate={navigate}
        goToToday={goToToday}
      />

      <div className="flex gap-4">
        <div className="flex w-56 shrink-0 flex-col">
          <div className="mb-4.5 h-12" />

          <div className="flex flex-col gap-1">
            {visibleHabits.map((habit) => (
              <HabitNameCell
                key={habit.id}
                habit={habit}
                streak={calculateStreak(entries, habit.id, today)}
                onHide={onHide}
              />
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
          <DayGridHeader layout={layout} />

          <div className="flex flex-col gap-1">
            {visibleHabits.map((habit) => (
              <HabitDayCells
                key={habit.id}
                habitId={habit.id}
                layout={layout}
                entriesByDate={entriesByHabit.get(habit.id)}
                onCellClick={onCellClick}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
