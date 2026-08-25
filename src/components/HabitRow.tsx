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
}

export function HabitRow({
  habit,
  streak,
  cells,
  size,
  onCellClick,
}: HabitRowProps) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex w-70 shrink-0 items-center gap-2.5">
        <span className="text-sm font-medium">{habit.name}</span>
        <StreakBadge streak={streak} />
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
