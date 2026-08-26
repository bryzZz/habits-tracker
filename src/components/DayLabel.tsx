import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

import { CELL_PX, type GridViewMode } from "../lib/dayGrid";

interface DayLabelProps {
  date: string;
  isToday: boolean;
  size: GridViewMode;
}

export function DayLabel({ date, isToday, size }: DayLabelProps) {
  const d = dayjs(date);
  const weekday = d.format("dd");

  return (
    <div
      className={twMerge(
        "shrink-0 text-center border-2 border-transparent rounded-lg py-0.5",
        isToday && "text-ink border-priority"
      )}
      style={{ width: CELL_PX[size] }}
    >
      <div
        className={twMerge(
          "text-ink-muted text-[11px] mb-0.5 font-bold tracking-wide uppercase",
          isToday && "text-ink"
        )}
      >
        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
      </div>

      <div
        className={twMerge(
          "text-ink-secondary text-xs tabular-nums",
          isToday && "text-ink"
        )}
      >
        {d.date()}
      </div>
    </div>
  );
}
