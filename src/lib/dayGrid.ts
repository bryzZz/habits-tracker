import type { Dayjs } from "dayjs";

export type GridViewMode = "week" | "month";

/** How far the day grid can be scrolled in either direction from today. */
const SCROLLABLE_YEARS = 5;

/** DayCell width per view mode */
export const CELL_PX: Record<GridViewMode, number> = { week: 40, month: 26 };

const CELL_GAP_PX = 4; // tailwind `gap-1`
const BLOCK_GAP_PX = 20; // visual gap (incl. divider) between adjacent blocks

/** Width of a block's cells, gaps included, excluding the gap to the next block. */
export function blockContentWidth(
  viewMode: GridViewMode,
  dayCount: number
): number {
  return dayCount * CELL_PX[viewMode] + (dayCount - 1) * CELL_GAP_PX;
}

/** Full width a block occupies on the virtualized axis, including the trailing inter-block gap. */
export function blockSlotWidth(
  viewMode: GridViewMode,
  dayCount: number
): number {
  return blockContentWidth(viewMode, dayCount) + BLOCK_GAP_PX;
}

/** Start of the block (week/month) containing `date`. */
export function originBlockStart(viewMode: GridViewMode, date: Dayjs): Dayjs {
  return date.startOf(viewMode === "week" ? "week" : "month");
}

/** All ISO (`YYYY-MM-DD`) dates belonging to the block starting at `start`. */
export function datesInBlock(viewMode: GridViewMode, start: Dayjs): string[] {
  const count = viewMode === "week" ? 7 : start.daysInMonth();
  return Array.from({ length: count }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );
}

/** Total number of addressable blocks spanning ±`SCROLLABLE_YEARS` around the origin. index `originIndex()` is the origin block itself. */
export function totalBlocks(viewMode: GridViewMode): number {
  const half =
    viewMode === "week"
      ? Math.ceil((SCROLLABLE_YEARS * 365) / 7)
      : SCROLLABLE_YEARS * 12;
  return 2 * half + 1;
}

/** Index of the origin block — the midpoint of the `totalBlocks` range. */
export function originIndex(viewMode: GridViewMode): number {
  return (totalBlocks(viewMode) - 1) / 2;
}

/** Start date of the block at `index`, relative to `origin` (which must itself be a block start, at `originIndex`). */
export function blockStartForIndex(
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): Dayjs {
  const offset = index - originIndex(viewMode);
  return viewMode === "week"
    ? origin.add(offset * 7, "day")
    : origin.add(offset, "month");
}

/** Number of days in the block at `index` (always 7 for weeks, variable for months). */
export function dayCountForIndex(
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): number {
  return viewMode === "week"
    ? 7
    : blockStartForIndex(viewMode, origin, index).daysInMonth();
}

/**
 * Pixel offset of block `index`'s left edge along the virtualized axis,
 * computed the same way react-virtual's own item offsets are (a prefix sum
 * of each preceding block's slot width) — used to drive `scrollLeft`
 * directly instead of `virtualizer.scrollToIndex`, whose internal `align`
 * math doesn't land exactly on this value in this app's nested-row layout.
 */
export function offsetForIndex(
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): number {
  if (viewMode === "week") return index * blockSlotWidth("week", 7);
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += blockSlotWidth("month", dayCountForIndex("month", origin, i));
  }
  return offset;
}

/** Inverse of `offsetForIndex`: which block index contains pixel `offset`. */
export function indexForOffset(
  viewMode: GridViewMode,
  origin: Dayjs,
  offset: number
): number {
  if (viewMode === "week") {
    return Math.floor(offset / blockSlotWidth("week", 7));
  }
  let acc = 0;
  const total = totalBlocks("month");
  for (let i = 0; i < total; i++) {
    const width = blockSlotWidth("month", dayCountForIndex("month", origin, i));
    if (acc + width > offset) return i;
    acc += width;
  }
  return total - 1;
}

/** Inverse of `blockStartForIndex`: the index of the block containing `date`. */
export function indexForDate(
  viewMode: GridViewMode,
  origin: Dayjs,
  date: Dayjs
): number {
  const start = originBlockStart(viewMode, date);
  const offset =
    viewMode === "week"
      ? Math.round(start.diff(origin, "day") / 7)
      : start.diff(origin, "month");
  return originIndex(viewMode) + offset;
}
