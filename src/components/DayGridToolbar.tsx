import type { Dispatch, FC, SetStateAction } from "react";

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

export const DayGridToolbar: FC<DayGridToolbarProps> = ({
  rangeLabel,
  overallScore,
  viewMode,
  setViewMode,
  navigate,
  goToToday,
}) => {
  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-6.5 rounded-md bg-linear-to-br from-priority to-[#0ca30c]" />

          <span className="font-display text-lg font-bold">Привычки</span>
        </div>

        {overallScore !== null && (
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: "#9bac14" }}
            />

            <span className="text-xs text-ink-muted">
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
};
