import { useVirtualizer } from "@tanstack/react-virtual";
import type { Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  blockSlotWidth,
  blockStartForIndex,
  datesInBlock,
  dayCountForIndex,
  type GridViewMode,
  indexForDate,
  indexForOffset,
  offsetForIndex,
  originBlockStart,
  originIndex,
  totalBlocks,
} from "../lib/dayGrid";

export interface DayGridBlock {
  key: number;
  index: number;
  start: number;
  size: number;
  dates: string[];
}

/** The virtualized-grid props `DayGridHeader` and `HabitDayCells` both need — kept as one type since they always travel together. */
export interface DayGridLayout {
  blocks: DayGridBlock[];
  totalWidth: number;
  today: Dayjs;
  size: GridViewMode;
}

/** Drives the virtualized week/month day grid: mounted blocks, the current
 * range label, and arrow/"today" navigation — see src/lib/dayGrid.ts. */
export const useDayGrid = (today: Dayjs) => {
  const [viewMode, setViewMode] = useState<GridViewMode>("week");
  const [focusDate, setFocusDate] = useState(today);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ignoreNextScrollEnd = useRef(false);

  const origin = useMemo(
    () => originBlockStart(viewMode, today),
    [viewMode, today]
  );

  const virtualizer = useVirtualizer({
    count: totalBlocks(viewMode),
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      blockSlotWidth(viewMode, dayCountForIndex(viewMode, origin, index)),
    horizontal: true,
    overscan: 2,
  });

  const currentIndex = indexForDate(viewMode, origin, focusDate);
  const currentBlockStart = blockStartForIndex(viewMode, origin, currentIndex);

  const virtualItems = virtualizer.getVirtualItems();
  const totalWidth = virtualizer.getTotalSize();

  // Memoized against react-virtual's own stable output, or `blocks`/`layout`
  // get a new identity every render and defeat `React.memo` on row/header components.
  const blocks: DayGridBlock[] = useMemo(
    () =>
      virtualItems.map((item) => ({
        key: item.key as number,
        index: item.index,
        start: item.start,
        size: item.size,
        dates: datesInBlock(
          viewMode,
          blockStartForIndex(viewMode, origin, item.index)
        ),
      })),
    [virtualItems, viewMode, origin]
  );

  const layout: DayGridLayout = useMemo(
    () => ({ blocks, totalWidth, today, size: viewMode }),
    [blocks, totalWidth, today, viewMode]
  );

  // Driven by our own pixel math (matching react-virtual's own item offsets)
  // rather than `virtualizer.scrollToIndex`, which doesn't land the same place.
  const scrollToIndex = (index: number, behavior?: ScrollBehavior) => {
    ignoreNextScrollEnd.current = true;
    setTimeout(() => {
      ignoreNextScrollEnd.current = false;
    }, 1000);
    scrollRef.current?.scrollTo({
      left: offsetForIndex(viewMode, origin, index),
      behavior,
    });
  };

  const navigate = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      totalBlocks(viewMode) - 1
    );
    setFocusDate(blockStartForIndex(viewMode, origin, nextIndex));
    scrollToIndex(nextIndex, "smooth");
  };

  const goToToday = () => {
    setFocusDate(today);
    scrollToIndex(originIndex(viewMode), "smooth");
  };

  // Reposition on mount and whenever the view mode changes (block sizing
  // differs completely between week/month).
  useEffect(() => {
    scrollToIndex(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Scroll-spy: updates the range label once scrolling settles (native
  // `scrollend`), ignoring scrollend caused by our own scrollToIndex.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScrollEnd = () => {
      if (ignoreNextScrollEnd.current) {
        ignoreNextScrollEnd.current = false;
        return;
      }
      const index = indexForOffset(viewMode, origin, el.scrollLeft);
      setFocusDate(blockStartForIndex(viewMode, origin, index));
    };
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [viewMode, origin]);

  return {
    viewMode,
    setViewMode,
    scrollRef,
    layout,
    currentBlockStart,
    navigate,
    goToToday,
  };
};
