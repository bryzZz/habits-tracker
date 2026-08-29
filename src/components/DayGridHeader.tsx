import { type Dayjs } from "dayjs";
import type { FC } from "react";

import { toISODate } from "../lib/dates";
import { DayCellsRow } from "./DayCellsRow";
import { DayLabel } from "./DayLabel";

interface DayGridHeaderProps {
  today: Dayjs;
  dates: Dayjs[];
}

export const DayGridHeader: FC<DayGridHeaderProps> = ({ today, dates }) => {
  return (
    <DayCellsRow
      dates={dates}
      className="mb-4.5 h-12 items-center border-b border-border"
      renderDate={(date) => (
        <DayLabel
          key={toISODate(date)}
          date={date}
          isToday={date.isSame(today, "day")}
        />
      )}
    />
  );
};
