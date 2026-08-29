import { Flame } from "lucide-react";
import type { FC } from "react";

import { MonthHeatmap } from "../components/MonthHeatmap";
import { QueryBoundary } from "../components/QueryBoundary";
import { StatTile } from "../components/StatTile";
import { TrendLine } from "../components/TrendLine";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { useStats } from "../hooks/useStats";
import { formatMonthYear } from "../lib/dates";
import { pluralizeDays } from "../lib/pluralize";
import { colorForScore } from "../lib/scoreRamp";

export const StatsPage: FC = () => {
  const {
    today,
    period,
    setPeriod,
    habits,
    habitsLoading,
    habitsError,
    entriesLoading,
    entriesError,
    effectiveHabitId,
    setSelectedHabitId,
    currentStreak,
    bestStreak,
    overallByDate,
    selectedHabit,
    trendPoints,
    periodAvg,
  } = useStats();

  return (
    <QueryBoundary
      isLoading={habitsLoading || entriesLoading}
      error={habitsError ?? entriesError}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-12">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Статистика</h1>

          <ToggleGroup
            type="single"
            variant="outline"
            value={period}
            onValueChange={(v) => v && setPeriod(v as typeof period)}
          >
            <ToggleGroupItem value="week">Неделя</ToggleGroupItem>

            <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="mb-7 rounded-xl border border-border bg-card p-6">
          <div className="mb-4.5 flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-display text-base font-semibold">
              Общая картина — {formatMonthYear(today)}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">0</span>

              <div className="flex gap-px">
                {[0, 2, 4, 5, 6, 8, 10].map((s) => (
                  <div
                    key={s}
                    className="h-2.5 w-3.5"
                    style={{ backgroundColor: colorForScore(s / 10) }}
                  />
                ))}
              </div>

              <span className="text-[11px] text-muted-foreground">10</span>
            </div>
          </div>

          <MonthHeatmap month={today} scoreByDate={overallByDate} />
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          value={effectiveHabitId}
          onValueChange={(v) => v && setSelectedHabitId(v)}
          className="mb-7 flex-wrap"
        >
          {habits.map((h) => (
            <ToggleGroupItem key={h.id} value={h.id} className="rounded-full!">
              {h.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {selectedHabit && (
          <div className="flex flex-col items-stretch gap-5 md:flex-row">
            <div className="grow rounded-xl border border-border bg-card p-6">
              <div className="mb-4.5 font-display text-base font-semibold">
                {selectedHabit.name} — тренд оценки
              </div>

              <TrendLine points={trendPoints} />
            </div>

            <div className="flex flex-col gap-3 md:w-65 md:shrink-0">
              <div className="rounded-xl border border-border bg-card p-6">
                <StatTile
                  label="Текущий стрик"
                  value={String(currentStreak)}
                  icon={
                    <Flame
                      className="size-7 text-[#f29a20]"
                      fill="currentColor"
                    />
                  }
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <StatTile
                  label="Лучший стрик"
                  value={`${bestStreak} ${pluralizeDays(bestStreak)}`}
                />

                <div className="my-3.5 h-px bg-border" />

                <StatTile
                  label={
                    period === "month"
                      ? "Средний балл за месяц"
                      : "Средний балл за неделю"
                  }
                  value={periodAvg !== null ? (periodAvg * 10).toFixed(1) : "—"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </QueryBoundary>
  );
};
