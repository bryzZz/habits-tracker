import type { FC, ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export const StatTile: FC<StatTileProps> = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-ink-muted">{label}</div>

      <div className="flex items-baseline gap-1">
        <div className="font-display text-4xl font-bold">{value}</div>

        {icon}
      </div>
    </div>
  );
};
