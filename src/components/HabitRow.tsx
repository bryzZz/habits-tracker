import { EyeOff } from "lucide-react";
import { DayCell } from "./DayCell";
import { StreakBadge } from "./StreakBadge";
import type { Habit } from "../data/types";

export interface HabitRowCell {
  date: string;
  score: number | undefined;
  isFuture: boolean;
  isToday: boolean;
}

interface HabitRowProps {
  habit: Habit;
  streak: number;
  cells: HabitRowCell[];
  size: "week" | "month";
  onCellClick: (date: string, target: HTMLElement) => void;
  onHide: (habitId: string) => void;
}

export function HabitRow({
  habit,
  streak,
  cells,
  size,
  onCellClick,
  onHide,
}: HabitRowProps) {
  return (
    <div className="group flex items-center gap-4 py-1">
      <div className="flex w-70 shrink-0 items-center gap-2.5">
        <span className="text-sm font-medium">{habit.name}</span>
        <StreakBadge streak={streak} />
        <button
          type="button"
          onClick={() => onHide(habit.id)}
          aria-label={`Скрыть привычку «${habit.name}»`}
          className="text-ink-muted hover:text-ink ml-auto opacity-0 transition-opacity group-hover:opacity-100"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex grow gap-1">
        {cells.map((cell) => (
          <DayCell
            key={cell.date}
            score={cell.score}
            isFuture={cell.isFuture}
            isToday={cell.isToday}
            size={size}
            onClick={(e) => onCellClick(cell.date, e.currentTarget)}
          />
        ))}
      </div>
    </div>
  );
}
