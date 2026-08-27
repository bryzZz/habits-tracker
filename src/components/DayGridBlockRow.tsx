import type { FC, ReactNode } from "react";

import type { DayGridLayout } from "../hooks/useDayGrid";
import { cn } from "../lib/utils";

interface DayGridBlockRowProps {
  layout: DayGridLayout;
  className: string;
  blockClassName?: string;
  renderDate: (date: string) => ReactNode;
}

/** Positions each virtualized block at its translateX offset. */
export const DayGridBlockRow: FC<DayGridBlockRowProps> = ({
  layout: { blocks, totalWidth },
  className,
  blockClassName,
  renderDate,
}) => {
  return (
    <div className={className} style={{ width: totalWidth }}>
      {blocks.map((block) => (
        <div
          key={block.key}
          className={cn(
            "absolute top-0 flex items-center gap-1 px-2",
            blockClassName
          )}
          style={{
            transform: `translateX(${block.start}px)`,
            width: block.size,
          }}
        >
          {block.dates.map((date) => renderDate(date))}
        </div>
      ))}
    </div>
  );
};
