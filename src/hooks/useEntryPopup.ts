import dayjs from "dayjs";
import { useState } from "react";

import type { DayEntry, Habit } from "../data/types";

interface Editing {
  habitId: string;
  date: string;
  anchorRect: DOMRect;
  entry: DayEntry | undefined;
}

/** Owned once by `WeekPage`, shared by grid and table cells — the caller
 * already has the clicked entry, so it's passed in rather than looked up. */
export const useEntryPopup = (
  habits: Habit[],
  onSaveEntry: (entry: DayEntry) => void
) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);

  const handleOpen = (
    habitId: string,
    date: string,
    target: HTMLElement,
    entry: DayEntry | undefined
  ) => {
    setEditing({
      habitId,
      date,
      anchorRect: target.getBoundingClientRect(),
      entry,
    });
    setOpen(true);
  };

  // Only flip `open` off, keep `editing` (and its `anchorRect`) around so
  // the popup doesn't jump to a fallback position while Radix animates it closed.
  const handleClose = () => setOpen(false);

  const handleSave = (score: number, note: string) => {
    if (!editing) return;

    onSaveEntry({
      habitId: editing.habitId,
      date: editing.date,
      score,
      note,
    });

    handleClose();
  };

  const editingHabit = editing && habits.find((h) => h.id === editing.habitId);

  return {
    handleOpen,
    entryPopupProps: {
      open: open && editingHabit !== undefined,
      entryKey: editing ? `${editing.habitId}:${editing.date}` : undefined,
      habitName: editingHabit?.name,
      dateLabel: editing
        ? dayjs(editing.date).format("dddd, D MMMM")
        : undefined,
      quickAnswers: editingHabit?.quickAnswers,
      initialScore: editing?.entry?.score ?? 0,
      initialNote: editing?.entry?.note ?? "",
      anchorRect: editing?.anchorRect,
      onSave: handleSave,
      onClose: handleClose,
    },
  };
};
