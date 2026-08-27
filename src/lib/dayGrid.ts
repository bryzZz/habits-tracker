import type { Dayjs } from "dayjs";

export type GridViewMode = "week" | "month";

/** Days per page in week mode — desktop pages two weeks at a time (there's
 * horizontal room to fill), mobile pages one. */
export const WEEK_PAGE_DAYS = { mobile: 7, desktop: 14 } as const;

/** Start of the page (week/month) containing `date`. */
export const pageStartFor = (viewMode: GridViewMode, date: Dayjs): Dayjs => {
  return date.startOf(viewMode === "week" ? "week" : "month");
};

/** All ISO (`YYYY-MM-DD`) dates in the page starting at `start`. */
export const datesInPage = (
  viewMode: GridViewMode,
  start: Dayjs,
  weekPageDays: number
): string[] => {
  const count = viewMode === "week" ? weekPageDays : start.daysInMonth();
  return Array.from({ length: count }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );
};

/** Start of the next/previous page. */
export const stepPage = (
  viewMode: GridViewMode,
  start: Dayjs,
  direction: -1 | 1,
  weekPageDays: number
): Dayjs => {
  return viewMode === "week"
    ? start.add(direction * weekPageDays, "day")
    : start.add(direction, "month");
};
