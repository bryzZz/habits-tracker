import dayjs from "dayjs";
import type { FC } from "react";

import { CELL_PX, type GridViewMode } from "../lib/dayGrid";
import { cn } from "../lib/utils";

interface DayLabelProps {
  date: string;
  isToday: boolean;
  size: GridViewMode;
}

export const DayLabel: FC<DayLabelProps> = ({ date, isToday, size }) => {
  const d = dayjs(date);
  const weekday = d.format("dd");

  return (
    <div
      className={cn(
        "shrink-0 rounded-lg border-2 border-transparent py-0.5 text-center",
        isToday && "border-priority text-ink"
      )}
      style={{ width: CELL_PX[size] }}
    >
      <div
        className={cn(
          "mb-0.5 text-[11px] font-bold tracking-wide text-ink-muted uppercase",
          isToday && "text-ink"
        )}
      >
        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
      </div>

      <div
        className={cn(
          "text-xs text-ink-secondary tabular-nums",
          isToday && "text-ink"
        )}
      >
        {d.date()}
      </div>
    </div>
  );
};
