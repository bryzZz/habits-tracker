import dayjs from "dayjs";
import type { FC } from "react";

import { cn } from "../lib/utils";

interface DayLabelProps {
  date: string;
  isToday: boolean;
}

export const DayLabel: FC<DayLabelProps> = ({ date, isToday }) => {
  const d = dayjs(date);
  const weekday = d.format("dd");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-2 border-transparent py-0.5 text-center",
        isToday && "border-priority text-foreground"
      )}
    >
      <div
        className={cn(
          "mb-0.5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase",
          isToday && "text-foreground"
        )}
      >
        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
      </div>

      <div
        className={cn(
          "text-xs text-ink-secondary tabular-nums",
          isToday && "text-foreground"
        )}
      >
        {d.date()}
      </div>
    </div>
  );
};
