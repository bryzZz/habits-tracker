import type { FC, MouseEvent } from "react";

import { CELL_PX } from "../lib/dayGrid";
import { colorForScore } from "../lib/scoreRamp";
import { cn } from "../lib/utils";

interface DayCellProps {
  score: number | undefined;
  isFuture: boolean;
  isToday: boolean;
  size: "week" | "month";
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const DayCell: FC<DayCellProps> = ({
  score,
  isFuture,
  isToday,
  size,
  onClick,
}) => {
  const baseClasses = cn(
    "shrink-0 border h-9.5",
    size === "week" && "rounded-md",
    size === "month" && "rounded-sm"
  );

  if (isFuture) {
    return (
      <button
        type="button"
        data-entry-trigger
        onClick={onClick}
        className={cn(baseClasses, "border-dashed border-border-strong")}
        style={{ width: CELL_PX[size] }}
      />
    );
  }

  return (
    <button
      type="button"
      data-entry-trigger
      onClick={onClick}
      className={cn(baseClasses, !isToday && "border-black/20")}
      style={{
        width: CELL_PX[size],
        backgroundColor: isToday
          ? "var(--color-surface)"
          : colorForScore(score ?? 0),
      }}
    />
  );
};
