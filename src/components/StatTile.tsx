import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function StatTile({ label, value, icon }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-ink-muted text-xs">{label}</div>
      <div className="flex items-baseline gap-2">
        {icon}
        <div className="font-display text-4xl font-bold">{value}</div>
      </div>
    </div>
  );
}
