import type { Dayjs } from "dayjs";

import { monthGridWeeks, weekdayLabels } from "../lib/dates";
import { colorForScore } from "../lib/scoreRamp";

interface MonthHeatmapProps {
  month: Dayjs;
  scoreByDate: Map<string, number>;
}

export function MonthHeatmap({ month, scoreByDate }: MonthHeatmapProps) {
  const weeks = monthGridWeeks(month);
  const labels = weekdayLabels();

  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col gap-1 pt-0.5">
        {labels.map((label) => (
          <div
            key={label}
            className="text-ink-muted flex h-9 items-center text-[11px]"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="flex grow flex-col gap-1">
        {weeks.map((week) => (
          <div
            key={week[0].format("YYYY-MM-DD")}
            className="grid grid-cols-7 gap-1"
          >
            {week.map((d) => {
              const iso = d.format("YYYY-MM-DD");
              const inMonth = d.isSame(month, "month");
              const score = inMonth ? scoreByDate.get(iso) : undefined;
              if (score === undefined) {
                return (
                  <div
                    key={iso}
                    className="border-border-strong h-9 rounded-lg border-[1.5px] border-dashed"
                  />
                );
              }
              return (
                <div
                  key={iso}
                  className="h-9 rounded-lg"
                  style={{ backgroundColor: colorForScore(score) }}
                  title={`${iso}: ${(score * 10).toFixed(1)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
