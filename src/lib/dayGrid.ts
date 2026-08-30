import type { Dayjs } from "dayjs";

export type GridViewMode = "week" | "twoWeeks" | "month";

export const DEFAULT_VIEW_MODE: GridViewMode = "twoWeeks";

export const VIEW_MODE_STORAGE_KEY = "day-grid-view-mode";

/** Fixed day counts, deliberately the same on mobile and desktop (see
 * ADR-0014, revising ADR-0007's device-dependent widening). */
const DAYS_PER_PAGE: Record<"week" | "twoWeeks", number> = {
  week: 7,
  twoWeeks: 14,
};

const startOfUnit = (viewMode: GridViewMode) =>
  viewMode === "month" ? "month" : "week";

/** Start of the page containing `date` for the given view mode. */
export const startOfPage = (viewMode: GridViewMode, date: Dayjs): Dayjs =>
  date.startOf(startOfUnit(viewMode));

/** All ISO (`YYYY-MM-DD`) dates in the page starting at `start`. */
export const datesInPage = (viewMode: GridViewMode, start: Dayjs): Dayjs[] => {
  const count =
    viewMode === "month" ? start.daysInMonth() : DAYS_PER_PAGE[viewMode];

  return Array.from({ length: count }, (_, i) => start.add(i, "day"));
};

/** Start of the next/previous page. */
export const stepPage = (
  viewMode: GridViewMode,
  start: Dayjs,
  direction: -1 | 1
): Dayjs => {
  return viewMode === "month"
    ? start.add(direction, "month")
    : start.add(direction * DAYS_PER_PAGE[viewMode], "day");
};

export const isGridViewMode = (value: string | null): value is GridViewMode =>
  value === "week" || value === "twoWeeks" || value === "month";

export const resolveViewMode = (stored: string | null): GridViewMode =>
  isGridViewMode(stored) ? stored : DEFAULT_VIEW_MODE;

export const readStoredViewMode = (): GridViewMode =>
  resolveViewMode(localStorage.getItem(VIEW_MODE_STORAGE_KEY));

export const writeStoredViewMode = (viewMode: GridViewMode): void => {
  localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
};
