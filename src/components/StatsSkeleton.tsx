import type { FC } from "react";

import { Skeleton } from "./ui/skeleton";

/** Placeholder shaped like `StatsPage`'s data-dependent content — see
 * QueryBoundary for the delay before this appears. */
export const StatsSkeleton: FC = () => {
  return (
    <>
      <Skeleton className="mb-7 h-64 w-full rounded-xl" />

      <div className="mb-7 flex flex-wrap gap-2.5">
        <Skeleton className="h-9.5 w-24 rounded-full" />

        <Skeleton className="h-9.5 w-24 rounded-full" />

        <Skeleton className="h-9.5 w-24 rounded-full" />
      </div>

      <div className="flex flex-col items-stretch gap-5 md:flex-row">
        <Skeleton className="h-64 grow rounded-xl" />

        <div className="flex flex-col gap-3 md:w-65 md:shrink-0">
          <Skeleton className="h-24 rounded-xl" />

          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </>
  );
};
