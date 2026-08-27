import { Flame } from "lucide-react";
import type { FC } from "react";

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: FC<StreakBadgeProps> = ({ streak }) => {
  if (streak <= 0) return null;

  return (
    <span className="inline-flex items-center gap-0.5 font-display text-[#f29a20]">
      {streak}
      <Flame className="size-4" fill="currentColor" />
    </span>
  );
};
