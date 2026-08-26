import type { Dayjs } from "dayjs";
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

/**
 * Owns `useDayGrid`'s virtualizer-backed scroll state. `@tanstack/react-virtual`
 * re-renders its caller on every native scroll event, not just when the
 * visible block set changes (see the `react-hooks/incompatible-library` lint
 * warning on `useDayGrid`) — measured at ~120 re-renders/sec during a scroll
 * gesture. Isolated into its own component so that frequency stays scoped to
 * the grid instead of forcing `WeekPage` itself (and everything else it
 * renders — the entry popup, hidden-habits accordion) to re-render along
 * with it. `DayGridToolbar` (badge/nav-row markup) is rendered directly here
 * rather than by `WeekPage`, so it re-renders at the grid's frequency too,
 * since it depends on `viewMode`/`currentBlockStart`, rather than at
 * `WeekPage`'s (now much lower) frequency.
 */
export function DayGrid({
  today,
  entries,
  visibleHabits,
  entriesByHabit,
  getOverallScoreForDate,
  onCellClick,
  onHide,
}: DayGridProps) {
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
}
