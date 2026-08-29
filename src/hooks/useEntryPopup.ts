import dayjs from "dayjs";
import { useState } from "react";

import type { DayEntry, Habit } from "../data/types";

interface Editing {
  habitId: string;
  date: string;
  anchorRect: DOMRect;
}

export const useEntryPopup = (
  habits: Habit[],
  entriesByHabit: Map<string, Map<string, DayEntry>>,
  onSaveEntry: (entry: DayEntry) => void
) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);

  const handleOpen = (habitId: string, date: string, target: HTMLElement) => {
    setEditing({ habitId, date, anchorRect: target.getBoundingClientRect() });
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
  const editingEntry =
    editingHabit &&
    editing &&
    entriesByHabit.get(editingHabit.id)?.get(editing.date);

  return {
    handleOpen,
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
      onClose: handleClose,
    },
  };
};
