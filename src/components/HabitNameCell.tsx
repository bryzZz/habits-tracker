import { EyeOff } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { FC } from "react";

import type { Habit } from "../data/types";
import { PRIORITY_LABELS } from "../data/types";
import { PRIORITY_COLOR } from "../lib/priorityStyles";
import { StreakBadge } from "./StreakBadge";

interface HabitNameCellProps {
  habit: Habit;
  streak: number;
  onHide: (habitId: string) => void;
}

export const HabitNameCell: FC<HabitNameCellProps> = ({
  habit,
  streak,
  onHide,
}) => {
  return (
    <div className="group relative flex items-center gap-2.5 md:h-11.5">
      <AccordionPrimitive.Trigger
        aria-label={`Описание привычки «${habit.name}»`}
        className="absolute inset-0"
      />

      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: PRIORITY_COLOR[habit.priority] }}
        title={PRIORITY_LABELS[habit.priority]}
      />

      <span className="truncate text-sm font-medium">{habit.name}</span>

      <StreakBadge streak={streak} />

      <button
        type="button"
        onClick={() => onHide(habit.id)}
        aria-label={`Скрыть привычку «${habit.name}»`}
        className="relative z-10 ml-auto shrink-0 text-muted-foreground transition-opacity hover:text-foreground md:opacity-0 md:group-hover:opacity-100"
      >
        <EyeOff className="size-3.5" />
      </button>
    </div>
  );
};
