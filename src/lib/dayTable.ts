import type { Dayjs } from "dayjs";

export type LayoutMode = "grid" | "table";

export const DEFAULT_LAYOUT_MODE: LayoutMode = "grid";

export const LAYOUT_MODE_STORAGE_KEY = "day-grid-layout-mode";

export const isLayoutMode = (value: string | null): value is LayoutMode =>
  value === "grid" || value === "table";

export const resolveLayoutMode = (stored: string | null): LayoutMode =>
  isLayoutMode(stored) ? stored : DEFAULT_LAYOUT_MODE;

export const readStoredLayoutMode = (): LayoutMode =>
  resolveLayoutMode(localStorage.getItem(LAYOUT_MODE_STORAGE_KEY));

export const writeStoredLayoutMode = (mode: LayoutMode): void => {
  localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, mode);
};

/** Large-but-finite stand-in for "unlimited" history (ADR-0017) — a real
 * infinite virtualizer isn't worth it for a personal habit tracker. */
export const TABLE_PAST_DAYS = 5 * 365;

/** Matches column `gap-1` (4px) — virtualized rows can't share a real CSS
 * `gap`, so each row's box is shrunk by this much and top-aligned instead. */
export const TABLE_ROW_GAP = 4;

/** A row's total slot in the virtualizer: content height plus `TABLE_ROW_GAP`. */
export const tableRowHeight = 42;

/** How far past today the table's scroll range reaches. */
export const TABLE_FUTURE_DAYS = 10;

export interface DayTableRange {
  /** Index 0 of the virtualized row list. */
  start: Dayjs;
  /** Index `count - 1` of the virtualized row list. */
  end: Dayjs;
  count: number;
  todayIndex: number;
}

/** The table's fixed row-index space: far past through `TABLE_FUTURE_DAYS`
 * ahead (ADR-0017 — unbounded past, future capped). */
export const tableDateRange = (today: Dayjs): DayTableRange => {
  const start = today.subtract(TABLE_PAST_DAYS, "day");
  const end = today.add(TABLE_FUTURE_DAYS, "day");

  return {
    start,
    end,
    count: end.diff(start, "day") + 1,
    todayIndex: today.diff(start, "day"),
  };
};

export const dateAtTableIndex = (start: Dayjs, index: number): Dayjs =>
  start.add(index, "day");
