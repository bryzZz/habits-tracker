import { monthGridWeeks, toISODate, WEEKDAY_LABELS } from "../lib/dates";
import { colorForScore } from "../lib/scoreRamp";

interface MonthHeatmapProps {
  month: Date;
  scoreByDate: Map<string, number>;
}

export function MonthHeatmap({ month, scoreByDate }: MonthHeatmapProps) {
  const weeks = monthGridWeeks(month);
  const monthIndex = month.getMonth();

  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col gap-1 pt-0.5">
        {WEEKDAY_LABELS.map((label) => (
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
          <div key={toISODate(week[0])} className="grid grid-cols-7 gap-1">
            {week.map((d) => {
              const iso = toISODate(d);
              const inMonth = d.getMonth() === monthIndex;
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
