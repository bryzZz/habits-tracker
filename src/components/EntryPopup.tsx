import { useState } from "react";

import type { QuickAnswer } from "../data/types";
import { colorForScore, scoreToStep, stepToScore } from "../lib/scoreRamp";
import { Button } from "./ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

interface EntryPopupProps {
  habitName: string;
  dateLabel: string;
  quickAnswers: QuickAnswer[];
  initialScore: number;
  initialNote: string;
  anchorRect: DOMRect;
  onSave: (score: number, note: string) => void;
  onClose: () => void;
}

export function EntryPopup({
  habitName,
  dateLabel,
  quickAnswers,
  initialScore,
  initialNote,
  anchorRect,
  onSave,
  onClose,
}: EntryPopupProps) {
  const [score, setScore] = useState(initialScore);
  const [note, setNote] = useState(initialNote);
  const step = scoreToStep(score);
  const color = colorForScore(score);

  return (
    <Popover open onOpenChange={(open) => !open && onClose()}>
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
      <PopoverContent align="start" sideOffset={8} className="w-80 p-4.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-[15px] font-semibold">
              {habitName}
            </div>
            <div className="text-ink-muted mt-0.5 text-xs">{dateLabel}</div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>

        {quickAnswers.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {quickAnswers.map((qa) => {
              const selected = Math.abs(qa.score - score) < 0.001;
              return (
                <button
                  key={qa.text}
                  type="button"
                  onClick={() => setScore(qa.score)}
                  className={
                    "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-[12.5px] " +
                    (selected ? "border-ink bg-white/10" : "border-border")
                  }
                >
                  <span>{qa.text}</span>
                  <span
                    className="ml-auto flex h-4.5 w-6 shrink-0 items-center justify-center rounded text-[10.5px] font-bold text-[#10130a] tabular-nums"
                    style={{ backgroundColor: colorForScore(qa.score) }}
                  >
                    {scoreToStep(qa.score)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-gridline h-px" />

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-ink-secondary text-[11.5px] font-semibold">
              Оценка
            </span>
            <span className="font-display text-lg font-bold">{step}</span>
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={[step]}
            onValueChange={([next]) => setScore(stepToScore(next))}
            rangeColor={color}
            className="mt-3"
          />
        </div>

        <div>
          <div className="text-ink-secondary mb-2 text-[11.5px] font-semibold">
            Заметка
          </div>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="resize-none text-[12.5px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="button" onClick={() => onSave(score, note)}>
            Сохранить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
