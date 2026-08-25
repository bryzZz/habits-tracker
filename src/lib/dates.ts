export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** Monday-based week start. */
export function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1) - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), 28));
}

export function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const monthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "long" });
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${weekStart.getDate()} – ${weekEnd.getDate()} ${monthFormatter.format(weekEnd)} ${weekEnd.getFullYear()}`;
  }
  return `${weekStart.getDate()} ${monthFormatter.format(weekStart)} – ${weekEnd.getDate()} ${monthFormatter.format(weekEnd)} ${weekEnd.getFullYear()}`;
}

export function formatMonthYear(d: Date): string {
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(d);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function isSameDate(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

/** Full calendar weeks (Monday-based) covering the given month, GitHub-style. */
export function monthGridWeeks(d: Date): Date[][] {
  const monthIndex = d.getMonth();
  const gridStart = startOfWeek(startOfMonth(d));
  const lastOfMonth = new Date(d.getFullYear(), monthIndex, daysInMonth(d));
  const gridEnd = addDays(startOfWeek(lastOfMonth), 6);

  const weeks: Date[][] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}
