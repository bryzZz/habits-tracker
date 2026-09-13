import { useVirtualizer } from "@tanstack/react-virtual";
import type { Dayjs } from "dayjs";
import type { FC, Ref } from "react";
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";

import type { DayEntry, Habit } from "@/data/types";
import { useDayTableEntries } from "@/data/useDayTableEntries";
import { toISODate } from "@/lib/dates";
import {
  dateAtTableIndex,
  TABLE_ROW_GAP,
  tableDateRange,
  tableRowHeight,
} from "@/lib/dayTable";
import { PRIORITY_COLOR } from "@/lib/priorityStyles";
import { cn } from "@/lib/utils";

import { DayCell } from "./DayCell";
import { Skeleton } from "./ui/skeleton";

const DATE_COLUMN_WIDTH = 136;
const HABIT_COLUMN_MIN_WIDTH = 88;

export interface DayTableHandle {
  scrollToToday: () => void;
}

interface DayTableProps {
  today: Dayjs;
  habits: Habit[];
  onCellClick: (
    habitId: string,
    date: string,
    target: HTMLElement,
    entry: DayEntry | undefined
  ) => void;
  ref?: Ref<DayTableHandle>;
}

const formatTableDate = (date: Dayjs): string => date.format("dd, DD MMM YYYY");

/** Rough guess for where the list's end sits before the scroll element has a
 * real measured height — close enough that the first paint isn't at index 0. */
const estimateInitialOffset = (totalCount: number) => () => {
  const viewportGuess =
    typeof window === "undefined" ? 600 : window.innerHeight * 0.7;

  return Math.max(0, totalCount * tableRowHeight - viewportGuess);
};

/** Continuous-scroll counterpart to `DayGrid` (ADR-0017) — same `onCellClick`
 * contract, so `WeekPage` owns a single shared `EntryPopup` for both. */
export const DayTable: FC<DayTableProps> = ({
  today,
  habits,
  onCellClick,
  ref,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledToToday = useRef(false);
  const range = tableDateRange(today);
  const gridTemplateColumns = `${DATE_COLUMN_WIDTH}px repeat(${habits.length}, minmax(${HABIT_COLUMN_MIN_WIDTH}px, 1fr))`;

  const rowVirtualizer = useVirtualizer({
    count: range.count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => tableRowHeight,
    overscan: 12,
    initialOffset: estimateInitialOffset(range.count),
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  // Before the initial scroll effect, `virtualItems` reflects scroll 0 (far
  // past) — fall back to `todayIndex` so the first render doesn't fetch it.
  const firstIndex = hasScrolledToToday.current
    ? (virtualItems[0]?.index ?? range.todayIndex)
    : range.todayIndex;
  const lastIndex = hasScrolledToToday.current
    ? (virtualItems.at(-1)?.index ?? range.todayIndex)
    : range.todayIndex;

  const { entriesByHabit, isDateLoading } = useDayTableEntries({
    start: dateAtTableIndex(range.start, firstIndex),
    end: dateAtTableIndex(range.start, lastIndex),
  });

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      rowVirtualizer.scrollToEnd({ behavior });
    },
    [rowVirtualizer]
  );

  useImperativeHandle(
    ref,
    () => ({ scrollToToday: () => scrollToBottom("smooth") }),
    [scrollToBottom]
  );

  // A plain effect (not layout) so it runs after the virtualizer's own
  // mount-time measurement, which would otherwise fight an earlier scroll.
  useEffect(() => {
    if (hasScrolledToToday.current) return;

    hasScrolledToToday.current = true;
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative h-[70vh] min-h-105 overflow-auto rounded-lg border border-border",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      )}
      style={{
        scrollbarColor: "var(--border) transparent",
      }}
    >
      <div className="w-fit min-w-full">
        <div
          className="sticky top-0 z-20 grid items-center gap-1 border-b border-border bg-background py-3"
          style={{ gridTemplateColumns }}
        >
          <div className="sticky left-0 z-10 min-w-0 self-stretch bg-background" />

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex min-w-0 items-center gap-1.5 px-3"
              title={habit.name}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: PRIORITY_COLOR[habit.priority] }}
                title={habit.name}
              />

              <span className="truncate text-xs font-medium">{habit.name}</span>
            </div>
          ))}
        </div>

        <div
          className="relative"
          style={{ height: rowVirtualizer.getTotalSize() }}
        >
          <div
            className="sticky left-0 z-20 border-r border-border"
            style={{
              width: DATE_COLUMN_WIDTH,
              height: rowVirtualizer.getTotalSize(),
            }}
          />

          {virtualItems.map((virtualRow) => {
            const date = dateAtTableIndex(range.start, virtualRow.index);
            const dateISO = toISODate(date);
            const isToday = date.isSame(today, "day");
            const isFuture = date.isAfter(today, "day");
            const loading = isDateLoading(dateISO);

            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 grid w-full gap-1"
                style={{
                  gridTemplateColumns,
                  height: virtualRow.size - TABLE_ROW_GAP,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className={cn(
                    "sticky left-0 z-10 flex min-w-0 items-center rounded-lg border-2 border-transparent bg-background px-3 text-xs text-muted-foreground",
                    isToday && "border-priority text-foreground"
                  )}
                >
                  <span className="min-w-0 truncate first-letter:uppercase">
                    {formatTableDate(date)}
                  </span>
                </div>

                {habits.map((habit) => {
                  const entry = entriesByHabit.get(habit.id)?.get(dateISO);

                  return (
                    <div key={habit.id} className="min-w-0">
                      {loading ? (
                        <Skeleton className="h-full w-full rounded-md" />
                      ) : (
                        <DayCell
                          score={entry?.score}
                          isFuture={isFuture}
                          isToday={isToday}
                          size="week"
                          className="h-full"
                          onClick={(e) =>
                            onCellClick(
                              habit.id,
                              dateISO,
                              e.currentTarget,
                              entry
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
