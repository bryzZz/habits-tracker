import dayjs from "dayjs";
import { useState } from "react";

import { formatMonthYear, formatWeekRange, toISODate } from "../lib/dates";
import {
  datesInPage,
  type GridViewMode,
  readStoredViewMode,
  startOfPage,
  stepPage,
  writeStoredViewMode,
} from "../lib/dayGrid";
import { cn } from "../lib/utils";
import { useIsDesktop } from "./useIsDesktop";

const scoreLabelFor = (viewMode: GridViewMode) => {
  if (viewMode === "month") return "Средний балл месяца";
  if (viewMode === "twoWeeks") return "Средний балл за 2 недели";
  return "Средний балл недели";
};

/** Drives the week/two-weeks/month day grid: the current page's dates, plus
 * arrow/swipe/"today" navigation — see src/lib/dayGrid.ts. */
export const useDayGrid = () => {
  const [today] = useState(() => dayjs());
  const [viewMode, setViewModeState] =
    useState<GridViewMode>(readStoredViewMode);
  const [focusDate, setFocusDate] = useState(today);
  const [direction, setDirection] = useState<-1 | 1>(1);

  const isDesktop = useIsDesktop();

  const pageStart = startOfPage(viewMode, focusDate);
  const isOnToday = pageStart.isSame(startOfPage(viewMode, today), "day");

  const dates = datesInPage(viewMode, pageStart);

  const dateRange = {
    start: dates[0],
    end: dates[dates.length - 1],
  };

  const rangeLabel =
    viewMode === "month"
      ? formatMonthYear(pageStart)
      : formatWeekRange(pageStart, dates.length);

  const scoreLabel = scoreLabelFor(viewMode);

  const pageKey = `${viewMode}-${toISODate(pageStart)}`;
  const pageTransitionClass = cn(
    "animate-in fade-in-0 duration-150",
    direction === 1 ? "slide-in-from-right-3" : "slide-in-from-left-3"
  );

  const setViewMode = (mode: GridViewMode) => {
    writeStoredViewMode(mode);
    setViewModeState(mode);
  };

  const navigate = (dir: -1 | 1) => {
    setDirection(dir);
    setFocusDate(stepPage(viewMode, pageStart, dir));
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
    rangeLabel,
    scoreLabel,
    pageKey,
    pageTransitionClass,
  };
};
