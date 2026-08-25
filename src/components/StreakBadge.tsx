interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak <= 0) return null;
  return (
    <span className="font-display inline-flex items-center gap-1 text-xs font-semibold text-[#f29a20]">
      <svg viewBox="0 0 24 24" className="h-3 w-3">
        <path
          d="M12 2c-1 3.5-4.5 6-4.5 10a4.5 4.5 0 1 0 9 0c0-1.5-.5-2.5-1-3.5.3 1 .2 2-.5 2.5-.2-2-1.5-3.5-3-9z"
          fill="currentColor"
        />
      </svg>
      {streak}
    </span>
  );
}
