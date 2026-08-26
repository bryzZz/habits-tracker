import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { DayGridLayout } from "../hooks/useDayGrid";

const BLOCK_CLASSNAME = "absolute top-0 flex items-center gap-1 px-2";

interface DayGridBlockRowProps {
  layout: DayGridLayout;
  className: string;
  blockClassName?: string;
  renderDate: (date: string) => ReactNode;
}

/** Shared virtualized-block wrapper for the day-grid header and each habit's day cells: positions every visible block at its `translateX` offset, delegating the per-date content to `renderDate`. */
export function DayGridBlockRow({
  layout: { blocks, totalWidth },
  className,
  blockClassName,
  renderDate,
}: DayGridBlockRowProps) {
  return (
    <div className={className} style={{ width: totalWidth }}>
      {blocks.map((block) => (
        <div
          key={block.key}
          className={twMerge(BLOCK_CLASSNAME, blockClassName)}
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
}
