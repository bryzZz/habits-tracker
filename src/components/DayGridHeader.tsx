import dayjs from "dayjs";
import { memo } from "react";

import type { DayGridLayout } from "../hooks/useDayGrid";
import { DayGridBlockRow } from "./DayGridBlockRow";
import { DayLabel } from "./DayLabel";

interface DayGridHeaderProps {
  layout: DayGridLayout;
}

export const DayGridHeader = memo(function DayGridHeader({
  layout,
}: DayGridHeaderProps) {
  const { today, size } = layout;

  return (
    <DayGridBlockRow
      layout={layout}
      className="border-gridline relative mb-4.5 h-12 border-b"
      renderDate={(date) => (
        <DayLabel
          key={date}
          date={date}
          isToday={dayjs(date).isSame(today, "day")}
          size={size}
        />
      )}
    />
  );
});
