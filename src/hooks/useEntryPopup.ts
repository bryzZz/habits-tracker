import dayjs from "dayjs";
import { useCallback, useState } from "react";

import type { DayEntry, HabitsData } from "../data/types";
import { LOCAL_USER_ID } from "../data/types";

interface Editing {
  habitId: string;
  date: string;
  anchorRect: DOMRect;
}

/** Stable identity so `HabitDayCells`'s `React.memo` isn't defeated by a
 * fresh closure per habit row on every render. */
export const useEntryPopup = (
  data: HabitsData,
  entriesByHabit: Map<string, Map<string, DayEntry>>,
  onSaveEntry: (entry: DayEntry) => void
) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);

  const openEditor = useCallback(
    (habitId: string, date: string, target: HTMLElement) => {
      setEditing({ habitId, date, anchorRect: target.getBoundingClientRect() });
      setOpen(true);
    },
    []
  );

  // Only flip `open` off, keep `editing` (and its `anchorRect`) around so
  // the popup doesn't jump to a fallback position while Radix animates it closed.
  const close = useCallback(() => setOpen(false), []);

  const editingHabit = editing
    ? data.habits.find((h) => h.id === editing.habitId)
    : undefined;

  const editingEntry =
    editing && editingHabit
      ? entriesByHabit.get(editingHabit.id)?.get(editing.date)
      : undefined;

  const handleSave = (score: number, note: string) => {
    if (!editing) return;

    onSaveEntry({
      userId: LOCAL_USER_ID,
      habitId: editing.habitId,
      date: editing.date,
      score,
      note,
    });

    close();
  };

  return {
    openEditor,
    entryPopupProps: {
      open: open && editingHabit !== undefined,
      habitName: editingHabit?.name,
      dateLabel: editing
        ? dayjs(editing.date).format("dddd, D MMMM")
        : undefined,
      quickAnswers: editingHabit?.quickAnswers,
      initialScore: editingEntry?.score ?? 0,
      initialNote: editingEntry?.note ?? "",
      anchorRect: editing?.anchorRect,
      onSave: handleSave,
      onClose: close,
    },
  };
};
