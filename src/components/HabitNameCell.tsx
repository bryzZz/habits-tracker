import { EyeOff } from "lucide-react";
import { type FC, memo } from "react";

import type { Habit } from "../data/types";
import { PRIORITY_LABELS } from "../data/types";
import { PRIORITY_COLOR } from "../lib/priorityStyles";
import { StreakBadge } from "./StreakBadge";

interface HabitNameCellProps {
  habit: Habit;
  streak: number;
  onHide: (habitId: string) => void;
}

export const HabitNameCell: FC<HabitNameCellProps> = memo(
  ({ habit, streak, onHide }) => {
    return (
      <div className="group flex h-11.5 items-center gap-2.5">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: PRIORITY_COLOR[habit.priority] }}
          title={PRIORITY_LABELS[habit.priority]}
        />

        <span className="text-sm font-medium">{habit.name}</span>

        <StreakBadge streak={streak} />

        <button
          type="button"
          onClick={() => onHide(habit.id)}
          aria-label={`Скрыть привычку «${habit.name}»`}
          className="ml-auto text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-ink"
        >
          <EyeOff className="size-3.5" />
        </button>
      </div>
    );
  }
);
