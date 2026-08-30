import type { FC } from "react";

import type { GridViewMode } from "../lib/dayGrid";
import { cn } from "../lib/utils";
import { NavArrowButton } from "./NavArrowButton";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface DayGridToolbarProps {
  rangeLabel: string;
  scoreLabel: string;
  overallScore: number | null;
  viewMode: GridViewMode;
  setViewMode: (mode: GridViewMode) => void;
  isOnToday: boolean;
  navigate: (direction: -1 | 1) => void;
  goToToday: () => void;
  pageKey: string;
  pageTransitionClass: string;
}

export const DayGridToolbar: FC<DayGridToolbarProps> = ({
  rangeLabel,
  scoreLabel,
  overallScore,
  viewMode,
  setViewMode,
  isOnToday,
  navigate,
  goToToday,
  pageKey,
  pageTransitionClass,
}) => {
  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="size-6.5 rounded-md bg-linear-to-br from-priority to-[#0ca30c]" />

          <span className="font-display text-lg font-bold">Привычки</span>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-4 py-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "#9bac14" }}
          />

          <span className="hidden text-xs text-muted-foreground md:inline">
            {scoreLabel}
          </span>

          <span
            key={pageKey}
            className={cn(
              "font-display text-base font-bold tabular-nums",
              pageTransitionClass
            )}
          >
            {overallScore !== null ? (overallScore * 10).toFixed(1) : "N/A"}
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center justify-center gap-3.5 md:flex-none md:justify-start">
          <div className="hidden items-center gap-3.5 md:flex">
            <NavArrowButton direction="left" onClick={() => navigate(-1)} />

            <NavArrowButton direction="right" onClick={() => navigate(1)} />
          </div>

          <button
            type="button"
            onClick={goToToday}
            disabled={isOnToday}
            title="Перейти к сегодня"
            className="font-display text-base font-semibold underline-offset-4 hover:underline disabled:no-underline"
          >
            <span
              key={pageKey}
              className={cn("inline-block", pageTransitionClass)}
            >
              {rangeLabel}
            </span>
          </button>
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as GridViewMode)}
          className="w-full justify-center md:ml-auto md:w-fit md:justify-start"
        >
          <ToggleGroupItem value="week">Неделя</ToggleGroupItem>

          <ToggleGroupItem value="twoWeeks">Две недели</ToggleGroupItem>

          <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
};
