import dayjs from "dayjs";
import { type FC, memo } from "react";

import type { DayGridLayout } from "../hooks/useDayGrid";
import { DayCellsRow } from "./DayCellsRow";
import { DayLabel } from "./DayLabel";

interface DayGridHeaderProps {
  layout: DayGridLayout;
}

export const DayGridHeader: FC<DayGridHeaderProps> = memo(({ layout }) => {
  const { today, dates } = layout;

  return (
    <DayCellsRow
      dates={dates}
      className="mb-4.5 h-12 items-center border-b border-border"
      renderDate={(date) => (
        <DayLabel
          key={date}
          date={date}
          isToday={dayjs(date).isSame(today, "day")}
        />
      )}
    />
  );
});
