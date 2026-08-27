import dayjs from "dayjs";
import { type FC, memo } from "react";

import type { DayEntry } from "../data/types";
import type { DayGridLayout } from "../hooks/useDayGrid";
import { DayCell } from "./DayCell";
import { DayCellsRow } from "./DayCellsRow";

interface HabitDayCellsProps {
  habitId: string;
  layout: DayGridLayout;
  entriesByDate: Map<string, DayEntry> | undefined;
  onCellClick: (habitId: string, date: string, target: HTMLElement) => void;
}

export const HabitDayCells: FC<HabitDayCellsProps> = memo(
  ({ habitId, layout, entriesByDate, onCellClick }) => {
    const { today, size, dates } = layout;

    return (
      <DayCellsRow
        dates={dates}
        className="h-11.5"
        renderDate={(date) => (
          <DayCell
            key={date}
            score={entriesByDate?.get(date)?.score}
            isFuture={dayjs(date).isAfter(today, "day")}
            isToday={dayjs(date).isSame(today, "day")}
            size={size}
            onClick={(e) => onCellClick(habitId, date, e.currentTarget)}
          />
        )}
      />
    );
  }
);
