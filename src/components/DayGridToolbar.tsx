import type { Dispatch, SetStateAction } from "react";

import type { GridViewMode } from "../lib/dayGrid";
import { NavArrowButton } from "./NavArrowButton";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface DayGridToolbarProps {
  rangeLabel: string;
  overallScore: number | null;
  viewMode: GridViewMode;
  setViewMode: Dispatch<SetStateAction<GridViewMode>>;
  navigate: (direction: -1 | 1) => void;
  goToToday: () => void;
}

export function DayGridToolbar({
  rangeLabel,
  overallScore,
  viewMode,
  setViewMode,
  navigate,
  goToToday,
}: DayGridToolbarProps) {
  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-6.5 w-6.5 rounded-[7px] bg-linear-to-br from-priority to-[#0ca30c]" />
          <span className="font-display text-lg font-bold">Привычки</span>
        </div>
        {overallScore !== null && (
          <div className="bg-surface border-border flex items-center gap-2.5 rounded-xl border px-4 py-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "#9bac14" }}
            />
            <span className="text-ink-muted text-xs">
              {viewMode === "week"
                ? "Средний балл недели"
                : "Средний балл месяца"}
            </span>
            <span className="font-display text-base font-bold">
              {(overallScore * 10).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center gap-3.5">
        <NavArrowButton direction="left" onClick={() => navigate(-1)} />
        <span className="font-display text-base font-semibold">
          {rangeLabel}
        </span>
        <Button type="button" variant="outline" onClick={goToToday}>
          Сегодня
        </Button>
        <NavArrowButton direction="right" onClick={() => navigate(1)} />
        <ToggleGroup
          type="single"
          variant="outline"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as typeof viewMode)}
          className="ml-auto"
        >
          <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
          <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}
