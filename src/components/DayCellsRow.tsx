import type { FC, ReactNode } from "react";

import { cn } from "../lib/utils";

interface DayCellsRowProps {
  dates: string[];
  className?: string;
  renderDate: (date: string) => ReactNode;
}

/** Lays out one page's dates as equal-width CSS grid columns, stretched to
 * fill the container — no fixed per-cell pixel width. */
export const DayCellsRow: FC<DayCellsRowProps> = ({
  dates,
  className,
  renderDate,
}) => {
  return (
    <div
      className={cn("grid gap-0.5 md:gap-1", className)}
      style={{ gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))` }}
    >
      {dates.map((date) => renderDate(date))}
    </div>
  );
};
