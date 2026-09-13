import { type Dayjs } from "dayjs";
import type { FC } from "react";

import type { DayEntry } from "../data/types";
import { toISODate } from "../lib/dates";
import type { GridViewMode } from "../lib/dayGrid";
import { DayCell } from "./DayCell";
import { DayCellsRow } from "./DayCellsRow";

interface HabitDayCellsProps {
  habitId: string;
  today: Dayjs;
  dates: Dayjs[];
  size: GridViewMode;
  entriesByDate: Map<string, DayEntry> | undefined;
  onCellClick: (
    habitId: string,
    date: string,
    target: HTMLElement,
    entry: DayEntry | undefined
  ) => void;
}

export const HabitDayCells: FC<HabitDayCellsProps> = ({
  habitId,
  today,
  dates,
  size,
  entriesByDate,
  onCellClick,
}) => {
  return (
    <DayCellsRow
      dates={dates}
      className="h-11.5"
      renderDate={(date) => {
        const dateISO = toISODate(date);
        const entry = entriesByDate?.get(dateISO);

        return (
          <DayCell
            key={dateISO}
            score={entry?.score}
            isFuture={date.isAfter(today, "day")}
            isToday={date.isSame(today, "day")}
            size={size}
            onClick={(e) =>
              onCellClick(habitId, dateISO, e.currentTarget, entry)
            }
          />
        );
      }}
    />
  );
};
