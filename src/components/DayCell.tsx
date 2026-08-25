import type { MouseEvent } from "react";

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
  const dims =
    size === "week"
      ? "h-11 w-12 rounded-[10px]"
      : "h-[38px] w-[23px] rounded-[6px]";

  if (isFuture) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`border-border-strong shrink-0 border-[1.5px] border-dashed ${dims}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 ${isToday ? "border-2 border-white" : "border border-black/20"} ${dims}`}
      style={{
        backgroundColor: colorForScore(score ?? 0),
        boxShadow: isToday ? "0 0 0 2px var(--color-page)" : undefined,
      }}
    />
  );
}
