import dayjs from "dayjs";
import { type FC, memo } from "react";

import type { DayGridLayout } from "../hooks/useDayGrid";
import { DayGridBlockRow } from "./DayGridBlockRow";
import { DayLabel } from "./DayLabel";

interface DayGridHeaderProps {
  layout: DayGridLayout;
}

export const DayGridHeader: FC<DayGridHeaderProps> = memo(({ layout }) => {
  const { today, size } = layout;

  return (
    <DayGridBlockRow
      layout={layout}
      className="relative mb-4.5 h-12 border-b border-gridline"
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
