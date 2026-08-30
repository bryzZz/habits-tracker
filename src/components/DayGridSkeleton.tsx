import type { FC } from "react";

import { Skeleton } from "./ui/skeleton";

const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i);

interface DayGridSkeletonProps {
  columnCount: number;
  isDesktop: boolean;
}

/** Placeholder shaped like `DayGrid`, shown while entries/habits are loading
 * — see QueryBoundary for the delay before this appears. */
export const DayGridSkeleton: FC<DayGridSkeletonProps> = ({
  columnCount,
  isDesktop,
}) => {
  const cellsRow = (key: number) => (
    <div
      key={key}
      className="grid gap-0.5 md:gap-1"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columnCount }, (_, i) => (
        <Skeleton key={i} className="h-9.5 w-full rounded-md" />
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="flex gap-4">
        <div className="flex w-56 shrink-0 flex-col gap-1">
          <div className="mb-4.5 h-12" />

          {SKELETON_ROWS.map((row) => (
            <Skeleton key={row} className="h-9.5 w-full" />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Skeleton className="mb-4.5 h-12 w-full" />

          {SKELETON_ROWS.map(cellsRow)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="mb-4.5 h-12 w-full" />

      {SKELETON_ROWS.map((row) => (
        <div key={row} className="flex flex-col gap-1.5">
          <Skeleton className="h-9.5 w-32" />

          {cellsRow(row)}
        </div>
      ))}
    </div>
  );
};
