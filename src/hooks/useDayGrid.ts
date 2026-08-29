import dayjs from "dayjs";
import { useState } from "react";

import {
  datesInPage,
  DAYS_PER_PAGE,
  type GridViewMode,
  stepPage,
} from "../lib/dayGrid";
import { useIsDesktop } from "./useIsDesktop";

/** Drives the week/month day grid: the current page's dates, plus
 * arrow/swipe/"today" navigation — see src/lib/dayGrid.ts. */
export const useDayGrid = () => {
  const [today] = useState(() => dayjs());
  const [viewMode, setViewMode] = useState<GridViewMode>("week");
  const [focusDate, setFocusDate] = useState(today);
  const [direction, setDirection] = useState<-1 | 1>(1);

  const isDesktop = useIsDesktop();

  const daysPerPage = isDesktop ? DAYS_PER_PAGE.desktop : DAYS_PER_PAGE.mobile;
  const pageStart = focusDate.startOf(viewMode);
  const isOnToday = pageStart.isSame(today.startOf(viewMode), "day");

  const dates = datesInPage(viewMode, pageStart, daysPerPage);

  const dateRange = {
    start: dates[0],
    end: dates[dates.length - 1],
  };

  const navigate = (dir: -1 | 1) => {
    setDirection(dir);
    setFocusDate(stepPage(viewMode, pageStart, dir, daysPerPage));
  };

  const goToToday = () => setFocusDate(today);

  return {
    today,
    viewMode,
    setViewMode,
    isDesktop,
    dates,
    dateRange,
    pageStart,
    isOnToday,
    direction,
    navigate,
    goToToday,
  };
};
