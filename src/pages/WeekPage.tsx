import type { FC } from "react";

import { useHabits } from "@/hooks/useHabits";

import { DayGrid } from "../components/DayGrid";
import { DayGridSkeleton } from "../components/DayGridSkeleton";
import { DayGridToolbar } from "../components/DayGridToolbar";
import { EntryPopup } from "../components/EntryPopup";
import { HiddenHabitsAccordion } from "../components/HiddenHabitsAccordion";
import { QueryBoundary } from "../components/QueryBoundary";
import { useDayGrid } from "../hooks/useDayGrid";
import { useEntryPopup } from "../hooks/useEntryPopup";
import { useSwipeNavigate } from "../hooks/useSwipeNavigate";

export const WeekPage: FC = () => {
  const {
    dateRange,
    today,
    dates,
    viewMode,
    setViewMode,
    isDesktop,
    isOnToday,
    navigate,
    goToToday,
    rangeLabel,
    scoreLabel,
    pageKey,
    pageTransitionClass,
  } = useDayGrid();

  const {
    visibleHabits,
    hiddenHabits,
    habitsLoading,
    habitsError,
    entriesByHabit,
    entriesLoading,
    entriesError,
    streaksByHabitId,
    overallScore,
    handleSaveEntry,
    handleHideHabit,
    handleShowHabit,
  } = useHabits(dateRange);

  const { handleOpen: openEditor, entryPopupProps } = useEntryPopup(
    visibleHabits,
    entriesByHabit,
    handleSaveEntry
  );

  const swipeHandlers = useSwipeNavigate(navigate);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-12">
      <DayGridToolbar
        rangeLabel={rangeLabel}
        scoreLabel={scoreLabel}
        overallScore={overallScore}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOnToday={isOnToday}
        navigate={navigate}
        goToToday={goToToday}
        pageKey={pageKey}
        pageTransitionClass={pageTransitionClass}
      />

      <div {...(isDesktop ? {} : swipeHandlers)}>
        <QueryBoundary
          isLoading={habitsLoading || entriesLoading}
          error={habitsError ?? entriesError}
          loadingFallback={
            <DayGridSkeleton columnCount={dates.length} isDesktop={isDesktop} />
          }
        >
          <DayGrid
            today={today}
            dates={dates}
            viewMode={viewMode}
            isDesktop={isDesktop}
            pageKey={pageKey}
            pageTransitionClass={pageTransitionClass}
            visibleHabits={visibleHabits}
            entriesByHabit={entriesByHabit}
            streaksByHabit={streaksByHabitId}
            onCellClick={openEditor}
            onHide={handleHideHabit}
          />

          <HiddenHabitsAccordion
            hiddenHabits={hiddenHabits}
            onShow={handleShowHabit}
          />

          <EntryPopup {...entryPopupProps} />
        </QueryBoundary>
      </div>
    </div>
  );
};
