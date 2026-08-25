import type { PriorityId } from "../data/types";
import { PRIORITY_LABELS } from "../data/types";
import { PRIORITY_COLOR } from "../lib/priorityStyles";

interface GroupHeaderProps {
  priority: PriorityId;
  count: number;
}

export function GroupHeader({ priority, count }: GroupHeaderProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: PRIORITY_COLOR[priority] }}
      />
      <span className="font-display text-sm font-semibold">
        {PRIORITY_LABELS[priority]}
      </span>
      <span className="text-ink-muted text-xs">{count}</span>
    </span>
  );
}
