import { useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { MonthHeatmap } from "../components/MonthHeatmap";
import { StatTile } from "../components/StatTile";
import { Flame } from "lucide-react";
import { TrendLine } from "../components/TrendLine";
import type { HabitsData } from "../data/types";
import { useHabitsView } from "../data/useHabitsView";
import {
  addDays,
  formatMonthYear,
  monthGridWeeks,
  startOfWeek,
  toISODate,
} from "../lib/dates";
import { pluralizeDays } from "../lib/pluralize";
import { colorForScore } from "../lib/scoreRamp";
import { calculateBestStreak, calculateStreak } from "../lib/streak";

type Period = "week" | "month";

const LEGEND_STEPS = [0, 2, 4, 5, 6, 8, 10];

interface StatsPageProps {
  data: HabitsData;
}

export function StatsPage({ data }: StatsPageProps) {
  const [period, setPeriod] = useState<Period>("month");
  const [selectedHabitId, setSelectedHabitId] = useState(
    () => data.habits[0]?.id ?? ""
  );
  const { today, todayISO, entriesByHabit, getOverallScoreForDate } =
    useHabitsView(data);

  const monthWeeks = useMemo(() => monthGridWeeks(today), [today]);

  const overallByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const week of monthWeeks) {
      for (const d of week) {
        if (d.getMonth() !== today.getMonth()) continue;
        const iso = toISODate(d);
        const score = getOverallScoreForDate(iso);
        if (score !== undefined) map.set(iso, score);
      }
    }
    return map;
  }, [monthWeeks, today, getOverallScoreForDate]);

  const selectedHabit = data.habits.find((h) => h.id === selectedHabitId);

  const trendPoints = useMemo(() => {
    if (!selectedHabit) return [];
    const byDate = entriesByHabit.get(selectedHabit.id);
    const rangeDates =
      period === "month"
        ? monthWeeks
            .flat()
            .filter((d) => d.getMonth() === today.getMonth())
            .map(toISODate)
        : Array.from({ length: 7 }, (_, i) =>
            toISODate(addDays(startOfWeek(today), i))
          );

    return rangeDates
      .filter((date) => date <= todayISO)
      .map((date) => ({ date, score: byDate?.get(date)?.score }))
      .filter(
        (p): p is { date: string; score: number } => p.score !== undefined
      );
  }, [selectedHabit, entriesByHabit, period, monthWeeks, todayISO, today]);

  const currentStreak = selectedHabit
    ? calculateStreak(data.entries, selectedHabit.id, today)
    : 0;
  const bestStreak = selectedHabit
    ? calculateBestStreak(data.entries, selectedHabit.id)
    : 0;
  const periodAvg =
    trendPoints.length > 0
      ? trendPoints.reduce((a, p) => a + p.score, 0) / trendPoints.length
      : null;

  return (
    <div className="mx-auto max-w-6xl px-12 py-8">
      <div className="mb-7 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Статистика</h1>
        <ToggleGroup
          type="single"
          variant="outline"
          value={period}
          onValueChange={(v) => v && setPeriod(v as Period)}
        >
          <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
          <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="bg-surface border-border mb-7 rounded-[14px] border p-6">
        <div className="mb-4.5 flex items-baseline justify-between">
          <div className="font-display text-base font-semibold">
            Общая картина — {formatMonthYear(today)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-muted text-[11px]">0</span>
            <div className="flex gap-px">
              {LEGEND_STEPS.map((s) => (
                <div
                  key={s}
                  className="h-2.5 w-3.5"
                  style={{ backgroundColor: colorForScore(s / 10) }}
                />
              ))}
            </div>
            <span className="text-ink-muted text-[11px]">10</span>
          </div>
        </div>
        <MonthHeatmap month={today} scoreByDate={overallByDate} />
      </div>

      <ToggleGroup
        type="single"
        variant="outline"
        value={selectedHabitId}
        onValueChange={(v) => v && setSelectedHabitId(v)}
        className="mb-7 flex-wrap"
      >
        {data.habits.map((h) => (
          <ToggleGroupItem key={h.id} value={h.id} className="rounded-full!">
            {h.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {selectedHabit && (
        <div className="flex items-stretch gap-5">
          <div className="bg-surface border-border grow rounded-[14px] border p-6">
            <div className="font-display mb-4.5 text-base font-semibold">
              {selectedHabit.name} — тренд оценки
            </div>
            <TrendLine points={trendPoints} />
          </div>
          <div className="flex w-65 shrink-0 flex-col gap-3">
            <div className="bg-surface border-border rounded-[14px] border p-6">
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
            <div className="bg-surface border-border rounded-[14px] border p-6">
              <StatTile
                label="Лучший стрик"
                value={`${bestStreak} ${pluralizeDays(bestStreak)}`}
              />
              <div className="bg-gridline my-3.5 h-px" />
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
  );
}
