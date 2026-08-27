import type { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

import {
  datesInPage,
  type GridViewMode,
  pageStartFor,
  stepPage,
  WEEK_PAGE_DAYS,
} from "../lib/dayGrid";
import { useIsDesktop } from "./useIsDesktop";

export interface DayGridLayout {
  dates: string[];
  today: Dayjs;
  size: GridViewMode;
}

/** Drives the week/month day grid: the current page's dates, plus
 * arrow/swipe/"today" navigation — see src/lib/dayGrid.ts. */
export const useDayGrid = (today: Dayjs) => {
  const [viewMode, setViewMode] = useState<GridViewMode>("week");
  const [focusDate, setFocusDate] = useState(today);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const isDesktop = useIsDesktop();

  const weekPageDays = isDesktop
    ? WEEK_PAGE_DAYS.desktop
    : WEEK_PAGE_DAYS.mobile;

  const pageStart = useMemo(
    () => pageStartFor(viewMode, focusDate),
    [viewMode, focusDate]
  );
  const isOnToday = pageStart.isSame(pageStartFor(viewMode, today), "day");

  const layout: DayGridLayout = useMemo(
    () => ({
      dates: datesInPage(viewMode, pageStart, weekPageDays),
      today,
      size: viewMode,
    }),
    [viewMode, pageStart, weekPageDays, today]
  );

  const navigate = (dir: -1 | 1) => {
    setDirection(dir);
    setFocusDate(stepPage(viewMode, pageStart, dir, weekPageDays));
  };

  const goToToday = () => setFocusDate(today);

  return {
    viewMode,
    setViewMode,
    isDesktop,
    layout,
    pageStart,
    isOnToday,
    direction,
    navigate,
    goToToday,
  };
};
