import type { FC } from "react";

import type { QuickAnswer } from "../data/types";
import { colorForScore, scoreToStep, stepToScore } from "../lib/scoreRamp";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

interface EntryFormBodyProps {
  quickAnswers: QuickAnswer[];
  score: number;
  note?: string;
  onQuickAnswerClick: (qa: QuickAnswer) => void;
  onScoreChange: (score: number) => void;
  onNoteChange: (note: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EntryFormBody: FC<EntryFormBodyProps> = ({
  quickAnswers,
  score,
  note,
  onQuickAnswerClick,
  onScoreChange,
  onNoteChange,
  onSave,
  onClose,
}) => {
  const step = scoreToStep(score);
  const color = colorForScore(score);

  return (
    <>
      {quickAnswers.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {quickAnswers.map((qa) => {
            const selected = Math.abs(qa.score - score) < 0.001;
            return (
              <button
                key={qa.text}
                type="button"
                onClick={() => onQuickAnswerClick(qa)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-xs",
                  selected ? "border-foreground bg-white/10" : "border-border"
                )}
              >
                <span>{qa.text}</span>

                <span
                  className="ml-auto flex h-4.5 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[#10130a] tabular-nums"
                  style={{ backgroundColor: colorForScore(qa.score) }}
                >
                  {scoreToStep(qa.score)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="h-px bg-border" />

      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold text-ink-secondary">
            Оценка
          </span>

          <span className="font-display text-lg font-bold">{step}</span>
        </div>

        <Slider
          min={0}
          max={10}
          step={1}
          value={[step]}
          onValueChange={([next]) => onScoreChange(stepToScore(next))}
          rangeColor={color}
          className="mt-3"
        />
      </div>

      <div>
        <div className="mb-2 text-[11px] font-semibold text-ink-secondary">
          Заметка
        </div>

        <Textarea
          value={note ?? ""}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
          className="resize-none text-xs"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>

        <Button type="button" onClick={onSave}>
          Сохранить
        </Button>
      </div>
    </>
  );
};
