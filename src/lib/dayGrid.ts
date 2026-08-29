import type { Dayjs } from "dayjs";

export type GridViewMode = "week" | "month";

/** Days per page in week mode — desktop pages two weeks at a time (there's
 * horizontal room to fill), mobile pages one. */
export const DAYS_PER_PAGE = { mobile: 7, desktop: 14 } as const;

/** All ISO (`YYYY-MM-DD`) dates in the page starting at `start`. */
export const datesInPage = (
  viewMode: GridViewMode,
  start: Dayjs,
  daysPerPage: number
) => {
  const count = viewMode === "week" ? daysPerPage : start.daysInMonth();

  return Array.from({ length: count }, (_, i) => start.add(i, "day"));
};

/** Start of the next/previous page. */
export const stepPage = (
  viewMode: GridViewMode,
  start: Dayjs,
  direction: -1 | 1,
  daysPerPage: number
): Dayjs => {
  return viewMode === "week"
    ? start.add(direction * daysPerPage, "day")
    : start.add(direction, "month");
};
