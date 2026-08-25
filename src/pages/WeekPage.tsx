import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { EntryPopup } from "../components/EntryPopup";
import { GroupHeader } from "../components/GroupHeader";
import { HabitRow } from "../components/HabitRow";
import type { HabitRowCell } from "../components/HabitRow";
import type { DayEntry, HabitsData } from "../data/types";
import { PRIORITY_ORDER } from "../data/types";
import { PRIORITY_TINT } from "../lib/priorityStyles";
import {
  addDays,
  addMonths,
  daysInMonth,
  formatMonthYear,
  formatWeekRange,
  startOfMonth,
  startOfWeek,
  toISODate,
  WEEKDAY_LABELS,
} from "../lib/dates";
import { buildEntriesByHabit, overallScoreForDate } from "../lib/habitsData";
import { calculateStreak } from "../lib/streak";

type ViewMode = "week" | "month";

interface WeekPageProps {
  data: HabitsData;
  onSaveEntry: (entry: DayEntry) => void;
}

interface Editing {
  habitId: string;
  date: string;
  anchorRect: DOMRect;
}

export function WeekPage({ data, onSaveEntry }: WeekPageProps) {
  const [anchor, setAnchor] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [today] = useState(() => new Date());
  const todayISO = toISODate(today);

  const dates = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeek(anchor);
      return Array.from({ length: 7 }, (_, i) => toISODate(addDays(start, i)));
    }
    const start = startOfMonth(anchor);
    const count = daysInMonth(anchor);
    return Array.from({ length: count }, (_, i) =>
      toISODate(addDays(start, i))
    );
  }, [anchor, viewMode]);

  const entriesByHabit = useMemo(
    () => buildEntriesByHabit(data.entries),
    [data.entries]
  );

  const overallScore = useMemo(() => {
    const daily = dates
      .map((date) => overallScoreForDate(data, entriesByHabit, date, todayISO))
      .filter((s): s is number => s !== undefined);
    if (daily.length === 0) return null;
    return daily.reduce((a, b) => a + b, 0) / daily.length;
  }, [data, entriesByHabit, dates, todayISO]);

  function navigate(direction: -1 | 1) {
    setAnchor((prev) =>
      viewMode === "week"
        ? addDays(prev, 7 * direction)
        : addMonths(prev, direction)
    );
  }

  function openEditor(habitId: string, date: string, target: HTMLElement) {
    setEditing({ habitId, date, anchorRect: target.getBoundingClientRect() });
  }

  function handleSave(score: number, note: string) {
    if (!editing) return;
    onSaveEntry({ habitId: editing.habitId, date: editing.date, score, note });
    setEditing(null);
  }

  const editingHabit = editing
    ? data.habits.find((h) => h.id === editing.habitId)
    : undefined;
  const editingEntry =
    editing && editingHabit
      ? entriesByHabit.get(editingHabit.id)?.get(editing.date)
      : undefined;

  return (
    <div className="mx-auto max-w-6xl px-12 py-8">
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Button>
        <span className="font-display text-base font-semibold">
          {viewMode === "week"
            ? formatWeekRange(startOfWeek(anchor))
            : formatMonthYear(anchor)}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => setAnchor(new Date())}
        >
          Сегодня
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate(1)}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Button>
        <ToggleGroup
          type="single"
          variant="outline"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as ViewMode)}
          className="ml-auto"
        >
          <ToggleGroupItem value="week">Неделя</ToggleGroupItem>
          <ToggleGroupItem value="month">Месяц</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === "week" && (
        <div className="border-gridline mb-4.5 flex items-center gap-4 border-b pb-2.5">
          <div className="w-70 shrink-0" />
          <div className="flex grow gap-1">
            {dates.map((date, i) => (
              <div key={date} className="w-12 text-center">
                <div className="text-ink-muted text-[11px] font-bold tracking-wide uppercase">
                  {WEEKDAY_LABELS[i]}
                </div>
                <div
                  className={
                    "mt-0.5 text-xs tabular-nums " +
                    (date === todayISO ? "text-ink" : "text-ink-secondary")
                  }
                >
                  {Number(date.slice(8, 10))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["priority", "active"]}>
        {PRIORITY_ORDER.map((priority) => {
          const habits = data.habits.filter(
            (h) => h.priority === priority && h.visible
          );
          if (habits.length === 0) return null;
          return (
            <AccordionItem
              key={priority}
              value={priority}
              className="mb-7 not-last:border-b-0 data-[state=closed]:opacity-65"
            >
              <AccordionTrigger
                className="items-center rounded-[9px] px-3.5 py-2 hover:no-underline"
                style={{ backgroundColor: PRIORITY_TINT[priority] }}
              >
                <GroupHeader priority={priority} count={habits.length} />
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {habits.map((habit) => {
                  const byDate = entriesByHabit.get(habit.id);
                  const cells: HabitRowCell[] = dates.map((date) => ({
                    date,
                    score: byDate?.get(date)?.score,
                    isFuture: date > todayISO,
                    isToday: date === todayISO,
                  }));
                  const streak = calculateStreak(data.entries, habit.id, today);
                  return (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      streak={streak}
                      cells={cells}
                      size={viewMode}
                      onCellClick={(date, target) =>
                        openEditor(habit.id, date, target)
                      }
                    />
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {editing && editingHabit && (
        <EntryPopup
          habitName={editingHabit.name}
          dateLabel={new Intl.DateTimeFormat("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date(`${editing.date}T00:00:00`))}
          quickAnswers={editingHabit.quickAnswers}
          initialScore={editingEntry?.score ?? 0}
          initialNote={editingEntry?.note ?? ""}
          anchorRect={editing.anchorRect}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
