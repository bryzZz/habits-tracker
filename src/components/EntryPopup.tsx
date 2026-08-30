import { X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

import type { QuickAnswer } from "../data/types";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { EntryFormBody } from "./EntryFormBody";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "./ui/drawer";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";

type AnchorRect = Pick<DOMRect, "top" | "left" | "width" | "height">;

interface EntryPopupProps {
  open: boolean;
  entryKey?: string;
  habitName?: string;
  dateLabel?: string;
  quickAnswers?: QuickAnswer[];
  initialScore?: number;
  initialNote?: string;
  anchorRect?: AnchorRect;
  onSave: (score: number, note: string) => void;
  onClose: () => void;
}

export const EntryPopup: FC<EntryPopupProps> = ({
  open,
  entryKey,
  habitName,
  dateLabel,
  quickAnswers = [],
  initialScore = 0,
  initialNote,
  anchorRect = { top: 0, left: 0, width: 0, height: 0 },
  onSave,
  onClose,
}) => {
  const [score, setScore] = useState(initialScore);
  const [note, setNote] = useState(initialNote);
  const [loadedEntryKey, setLoadedEntryKey] = useState(entryKey);
  const isDesktop = useIsDesktop();

  // Reset local edits when a different entry opens, without wiping unsaved edits just
  // because the same entry's initial values changed underneath (e.g. a background refetch).
  if (entryKey !== loadedEntryKey) {
    setLoadedEntryKey(entryKey);
    setScore(initialScore);
    setNote(initialNote);
  }

  const handleQuickAnswerClick = (qa: QuickAnswer) => {
    setScore(qa.score);
    setNote(qa.text ?? "");
  };

  const handleSave = () => onSave(score, note ?? "");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={(open) => !open && onClose()}>
        <PopoverAnchor asChild>
          <div
            style={{
              position: "fixed",
              top: anchorRect.top,
              left: anchorRect.left,
              width: anchorRect.width,
              height: anchorRect.height,
              pointerEvents: "none",
            }}
          />
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="max-h-(--radix-popover-content-available-height) w-80 overflow-y-auto p-4.5"
          onPointerDownOutside={(event) => {
            // Another day cell's onClick re-anchors this popup — don't let Radix's
            // outside-click handler close it first, or it flickers shut before reopening.
            if ((event.target as Element).closest("[data-entry-trigger]")) {
              event.preventDefault();
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-[15px] font-semibold">
                {habitName}
              </div>

              <div className="mt-0.5 text-xs text-muted-foreground">
                {dateLabel}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X className="size-3.5" />
            </Button>
          </div>

          <EntryFormBody
            quickAnswers={quickAnswers}
            score={score}
            note={note}
            onQuickAnswerClick={handleQuickAnswerClick}
            onScoreChange={setScore}
            onNoteChange={setNote}
            onSave={handleSave}
            onClose={onClose}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="gap-4 overflow-y-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <DrawerTitle className="font-display text-[15px] font-semibold">
              {habitName}
            </DrawerTitle>

            <DrawerDescription className="mt-0.5 text-xs">
              {dateLabel}
            </DrawerDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <EntryFormBody
          quickAnswers={quickAnswers}
          score={score}
          note={note}
          onQuickAnswerClick={handleQuickAnswerClick}
          onScoreChange={setScore}
          onNoteChange={setNote}
          onSave={handleSave}
          onClose={onClose}
        />
      </DrawerContent>
    </Drawer>
  );
};
