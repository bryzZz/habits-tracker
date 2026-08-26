import type { MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

import { CELL_PX } from "../lib/dayGrid";
import { colorForScore } from "../lib/scoreRamp";

interface DayCellProps {
  score: number | undefined;
  isFuture: boolean;
  isToday: boolean;
  size: "week" | "month";
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function DayCell({
  score,
  isFuture,
  isToday,
  size,
  onClick,
}: DayCellProps) {
  const baseClasses = twMerge(
    "shrink-0 border h-[38px]",
    size === "week" && "rounded-[8px]",
    size === "month" && "rounded-[6px]"
  );

  if (isFuture) {
    return (
      <button
        type="button"
        data-entry-trigger
        onClick={onClick}
        className={twMerge(baseClasses, "border-border-strong border-dashed")}
        style={{ width: CELL_PX[size] }}
      />
    );
  }

  return (
    <button
      type="button"
      data-entry-trigger
      onClick={onClick}
      className={twMerge(baseClasses, !isToday && "border-black/20")}
      style={{
        width: CELL_PX[size],
        backgroundColor: isToday
          ? "var(--color-surface)"
          : colorForScore(score ?? 0),
      }}
    />
  );
}
