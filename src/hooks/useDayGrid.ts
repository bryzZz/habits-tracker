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

/**
 * Drives the horizontally-scrollable, virtualized week/month day grid: which
 * blocks are mounted, the current (leftmost-visible) block for the range
 * label, and arrow/"today" navigation. Blocks are indexed relative to a
 * fixed origin (today's block at mount) so the addressable range never
 * shifts under navigation — see src/lib/dayGrid.ts.
 */
export function useDayGrid(today: Dayjs) {
  const [viewMode, setViewMode] = useState<GridViewMode>("week");
  const [focusDate, setFocusDate] = useState(today);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  // Scroll position is driven by our own pixel math (matching react-virtual's
  // item offsets exactly) rather than `virtualizer.scrollToIndex`, which
  // doesn't land on the same offset `getVirtualItems()` renders at in this
  // layout.
  const ignoreNextScrollEnd = useRef(false);
  function scrollToIndex(index: number, behavior?: ScrollBehavior) {
    ignoreNextScrollEnd.current = true;
    setTimeout(() => {
      ignoreNextScrollEnd.current = false;
    }, 1000);
    scrollRef.current?.scrollTo({
      left: offsetForIndex(viewMode, origin, index),
      behavior,
    });
  }

  // Reposition on mount and whenever the view mode changes (block sizing
  // differs completely between week/month).
  useEffect(() => {
    scrollToIndex(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Scroll-spy: update the range label once scrolling has settled (native
  // `scrollend`, not every scroll frame). Ignores scrollend caused by our
  // own programmatic scrollToIndex, which would otherwise collapse the
  // already-known focus date down to its block start.
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

  function navigate(direction: -1 | 1) {
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      totalBlocks(viewMode) - 1
    );
    setFocusDate(blockStartForIndex(viewMode, origin, nextIndex));
    scrollToIndex(nextIndex, "smooth");
  }

  function goToToday() {
    setFocusDate(today);
    scrollToIndex(originIndex(viewMode), "smooth");
  }

  // Memoized against react-virtual's own (referentially stable while the
  // visible range doesn't change) `getVirtualItems()` output — without this,
  // `blocks`/`layout` got a new identity on every render, defeating
  // `React.memo` on the row/header components and re-rendering every habit
  // row on every scroll-driven state update.
  const virtualItems = virtualizer.getVirtualItems();
  const totalWidth = virtualizer.getTotalSize();

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

  return {
    viewMode,
    setViewMode,
    scrollRef,
    layout,
    currentBlockStart,
    navigate,
    goToToday,
  };
}
