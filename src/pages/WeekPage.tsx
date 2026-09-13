import type { FC } from "react";
import { useRef } from "react";

import { useHabits } from "@/hooks/useHabits";
import { useLayoutMode } from "@/hooks/useLayoutMode";

import { DayGrid } from "../components/DayGrid";
import { DayGridSkeleton } from "../components/DayGridSkeleton";
import { DayGridToolbar } from "../components/DayGridToolbar";
import { DayTable, type DayTableHandle } from "../components/DayTable";
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

  const { layoutMode, setLayoutMode } = useLayoutMode();

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
    handleSaveEntry
  );

  const swipeHandlers = useSwipeNavigate(navigate);
  const dayTableRef = useRef<DayTableHandle>(null);

  const isGrid = layoutMode === "grid";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-12">
      <DayGridToolbar
        rangeLabel={rangeLabel}
        scoreLabel={scoreLabel}
        overallScore={overallScore}
        viewMode={viewMode}
        setViewMode={setViewMode}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        isOnToday={isOnToday}
        navigate={navigate}
        goToToday={goToToday}
        goToTableToday={() => dayTableRef.current?.scrollToToday()}
        pageKey={pageKey}
        pageTransitionClass={pageTransitionClass}
      />

      <QueryBoundary
        isLoading={habitsLoading || (isGrid && entriesLoading)}
        error={habitsError ?? (isGrid ? entriesError : null)}
        loadingFallback={
          <DayGridSkeleton columnCount={dates.length} isDesktop={isDesktop} />
        }
      >
        {isGrid ? (
          <div {...(isDesktop ? {} : swipeHandlers)}>
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
          </div>
        ) : (
          <DayTable
            ref={dayTableRef}
            today={today}
            habits={visibleHabits}
            onCellClick={openEditor}
          />
        )}

        <EntryPopup {...entryPopupProps} />

        <HiddenHabitsAccordion
          hiddenHabits={hiddenHabits}
          onShow={handleShowHabit}
        />
      </QueryBoundary>
    </div>
  );
};
