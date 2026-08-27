import type { FC, MouseEvent } from "react";

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
    "h-9.5 w-full border",
    size === "week" && "rounded-md",
    size === "month" && "rounded-xs md:rounded-sm"
  );

  if (isFuture) {
    return (
      <button
        type="button"
        data-entry-trigger
        onClick={onClick}
        className={cn(baseClasses, "border-dashed border-input")}
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
        backgroundColor:
          score === undefined ? "var(--muted)" : colorForScore(score ?? 0),
      }}
    />
  );
};
