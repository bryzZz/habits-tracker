import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak <= 0) return null;
  return (
    <span className="font-display inline-flex items-center gap-0.5 text-[#f29a20]">
      {streak}
      <Flame className="size-4" fill="currentColor" />
    </span>
  );
}
