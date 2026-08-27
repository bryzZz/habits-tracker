import type { Dayjs } from "dayjs";

export type GridViewMode = "week" | "month";

/** How far the day grid can be scrolled in either direction from today. */
const SCROLLABLE_YEARS = 5;

/** DayCell width per view mode */
export const CELL_PX: Record<GridViewMode, number> = { week: 40, month: 26 };

const CELL_GAP_PX = 4; // tailwind `gap-1`
const BLOCK_GAP_PX = 20; // visual gap (incl. divider) between adjacent blocks

/** Width of a block's cells, gaps included, excluding the gap to the next block. */
export const blockContentWidth = (
  viewMode: GridViewMode,
  dayCount: number
): number => {
  return dayCount * CELL_PX[viewMode] + (dayCount - 1) * CELL_GAP_PX;
};

/** Full width a block occupies on the virtualized axis, trailing gap included. */
export const blockSlotWidth = (
  viewMode: GridViewMode,
  dayCount: number
): number => {
  return blockContentWidth(viewMode, dayCount) + BLOCK_GAP_PX;
};

/** Start of the block (week/month) containing `date`. */
export const originBlockStart = (
  viewMode: GridViewMode,
  date: Dayjs
): Dayjs => {
  return date.startOf(viewMode === "week" ? "week" : "month");
};

/** All ISO (`YYYY-MM-DD`) dates belonging to the block starting at `start`. */
export const datesInBlock = (
  viewMode: GridViewMode,
  start: Dayjs
): string[] => {
  const count = viewMode === "week" ? 7 : start.daysInMonth();
  return Array.from({ length: count }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );
};

/** Total addressable blocks spanning ±`SCROLLABLE_YEARS` around the origin. */
export const totalBlocks = (viewMode: GridViewMode): number => {
  const half =
    viewMode === "week"
      ? Math.ceil((SCROLLABLE_YEARS * 365) / 7)
      : SCROLLABLE_YEARS * 12;
  return 2 * half + 1;
};

/** Index of the origin block — the midpoint of the `totalBlocks` range. */
export const originIndex = (viewMode: GridViewMode): number => {
  return (totalBlocks(viewMode) - 1) / 2;
};

/** Start date of the block at `index`, relative to `origin` (itself a block start, at `originIndex`). */
export const blockStartForIndex = (
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): Dayjs => {
  const offset = index - originIndex(viewMode);
  return viewMode === "week"
    ? origin.add(offset * 7, "day")
    : origin.add(offset, "month");
};

/** Number of days in the block at `index` (always 7 for weeks, variable for months). */
export const dayCountForIndex = (
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): number => {
  return viewMode === "week"
    ? 7
    : blockStartForIndex(viewMode, origin, index).daysInMonth();
};

/** Pixel offset of block `index`'s left edge, matching react-virtual's own
 * item offsets — used to drive `scrollLeft` directly (its `scrollToIndex` doesn't land exactly here). */
export const offsetForIndex = (
  viewMode: GridViewMode,
  origin: Dayjs,
  index: number
): number => {
  if (viewMode === "week") return index * blockSlotWidth("week", 7);
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += blockSlotWidth("month", dayCountForIndex("month", origin, i));
  }
  return offset;
};

/** Inverse of `offsetForIndex`: which block index contains pixel `offset`. */
export const indexForOffset = (
  viewMode: GridViewMode,
  origin: Dayjs,
  offset: number
): number => {
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
};

/** Inverse of `blockStartForIndex`: the index of the block containing `date`. */
export const indexForDate = (
  viewMode: GridViewMode,
  origin: Dayjs,
  date: Dayjs
): number => {
  const start = originBlockStart(viewMode, date);
  const offset =
    viewMode === "week"
      ? Math.round(start.diff(origin, "day") / 7)
      : start.diff(origin, "month");
  return originIndex(viewMode) + offset;
};
