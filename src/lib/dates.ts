import dayjs, { type Dayjs } from "dayjs";

export const formatWeekRange = (weekStart: Dayjs): string => {
  const weekEnd = weekStart.add(6, "day");
  if (weekStart.month() === weekEnd.month()) {
    return `${weekStart.date()} – ${weekEnd.format("D MMMM YYYY")}`;
  }
  return `${weekStart.format("D MMMM")} – ${weekEnd.format("D MMMM YYYY")}`;
};

export const formatMonthYear = (d: Dayjs): string => {
  const formatted = d.format("MMMM YYYY");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/** Short weekday labels in calendar order, following the active locale's week-start. */
export const weekdayLabels = (): string[] => {
  const start = dayjs().startOf("week");
  return Array.from({ length: 7 }, (_, i) => {
    const label = start.add(i, "day").format("dd");
    return label.charAt(0).toUpperCase() + label.slice(1);
  });
};

/** Full calendar weeks covering the given month, GitHub-style. */
export const monthGridWeeks = (d: Dayjs): Dayjs[][] => {
  const gridStart = d.startOf("month").startOf("week");
  const gridEnd = d.endOf("month").startOf("week").add(6, "day");

  const weeks: Dayjs[][] = [];
  let cursor = gridStart;
  while (cursor.isSameOrBefore(gridEnd, "day")) {
    const week: Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = cursor.add(1, "day");
    }
    weeks.push(week);
  }
  return weeks;
};
