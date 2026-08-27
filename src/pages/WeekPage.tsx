import type { FC } from "react";
import { useCallback } from "react";

import { DayGrid } from "../components/DayGrid";
import { EntryPopup } from "../components/EntryPopup";
import { HiddenHabitsAccordion } from "../components/HiddenHabitsAccordion";
import type { DayEntry, HabitsData } from "../data/types";
import { useHabitsView } from "../data/useHabitsView";
import { useEntryPopup } from "../hooks/useEntryPopup";
import { useVisibleHabits } from "../hooks/useVisibleHabits";

interface WeekPageProps {
  data: HabitsData;
  onSaveEntry: (entry: DayEntry) => void;
  onToggleVisibility: (habitId: string, visible: boolean) => void;
}

export const WeekPage: FC<WeekPageProps> = ({
  data,
  onSaveEntry,
  onToggleVisibility,
}) => {
  const { today, entriesByHabit, getOverallScoreForDate } = useHabitsView(data);
  const { visibleHabits, hiddenHabits } = useVisibleHabits(data.habits);
  const { openEditor, entryPopupProps } = useEntryPopup(
    data,
    entriesByHabit,
    onSaveEntry
  );

  const handleHide = useCallback(
    (habitId: string) => onToggleVisibility(habitId, false),
    [onToggleVisibility]
  );
  const handleShow = useCallback(
    (habitId: string) => onToggleVisibility(habitId, true),
    [onToggleVisibility]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-12">
      <DayGrid
        today={today}
        entries={data.entries}
        visibleHabits={visibleHabits}
        entriesByHabit={entriesByHabit}
        getOverallScoreForDate={getOverallScoreForDate}
        onCellClick={openEditor}
        onHide={handleHide}
      />

      <HiddenHabitsAccordion hiddenHabits={hiddenHabits} onShow={handleShow} />

      <EntryPopup {...entryPopupProps} />
    </div>
  );
};
