import type { FC } from "react";

import { useHabits } from "@/hooks/useHabits";

import { DayGrid } from "../components/DayGrid";
import { EntryPopup } from "../components/EntryPopup";
import { HiddenHabitsAccordion } from "../components/HiddenHabitsAccordion";
import { QueryBoundary } from "../components/QueryBoundary";
import { useDayGrid } from "../hooks/useDayGrid";
import { useEntryPopup } from "../hooks/useEntryPopup";

export const WeekPage: FC = () => {
  const {
    dateRange,
    today,
    dates,
    viewMode,
    setViewMode,
    isDesktop,
    pageStart,
    isOnToday,
    direction,
    navigate,
    goToToday,
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

  return (
    <QueryBoundary
      isLoading={habitsLoading || entriesLoading}
      error={habitsError ?? entriesError}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-12">
        <DayGrid
          today={today}
          dates={dates}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isDesktop={isDesktop}
          pageStart={pageStart}
          isOnToday={isOnToday}
          direction={direction}
          navigate={navigate}
          goToToday={goToToday}
          visibleHabits={visibleHabits}
          entriesByHabit={entriesByHabit}
          streaksByHabit={streaksByHabitId}
          overallScore={overallScore}
          onCellClick={openEditor}
          onHide={handleHideHabit}
        />

        <HiddenHabitsAccordion
          hiddenHabits={hiddenHabits}
          onShow={handleShowHabit}
        />

        <EntryPopup {...entryPopupProps} />
      </div>
    </QueryBoundary>
  );
};
