import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  datesInPage,
  isGridViewMode,
  resolveViewMode,
  startOfPage,
  stepPage,
} from "./dayGrid";

describe("datesInPage", () => {
  it("returns 7 fixed dates for week mode", () => {
    const start = dayjs("2026-08-24");
    const dates = datesInPage("week", start);
    expect(dates).toHaveLength(7);
    expect(dates[6].format("YYYY-MM-DD")).toBe("2026-08-30");
  });

  it("returns 14 fixed dates for two-weeks mode", () => {
    const start = dayjs("2026-08-24");
    const dates = datesInPage("twoWeeks", start);
    expect(dates).toHaveLength(14);
    expect(dates[13].format("YYYY-MM-DD")).toBe("2026-09-06");
  });

  it("returns every day of the calendar month for month mode", () => {
    const start = dayjs("2026-02-01");
    const dates = datesInPage("month", start);
    expect(dates).toHaveLength(28);
  });
});

describe("stepPage", () => {
  it("steps by exactly 7 days for week mode, regardless of direction", () => {
    const start = dayjs("2026-08-24");
    expect(stepPage("week", start, 1).format("YYYY-MM-DD")).toBe("2026-08-31");
    expect(stepPage("week", start, -1).format("YYYY-MM-DD")).toBe("2026-08-17");
  });

  it("steps by exactly 14 days for two-weeks mode", () => {
    const start = dayjs("2026-08-24");
    expect(stepPage("twoWeeks", start, 1).format("YYYY-MM-DD")).toBe(
      "2026-09-07"
    );
    expect(stepPage("twoWeeks", start, -1).format("YYYY-MM-DD")).toBe(
      "2026-08-10"
    );
  });

  it("steps by a calendar month for month mode", () => {
    const start = dayjs("2026-01-31");
    expect(stepPage("month", start, 1).format("YYYY-MM-DD")).toBe("2026-02-28");
  });
});

describe("startOfPage", () => {
  it("aligns week and two-weeks mode to the start of the week", () => {
    const date = dayjs("2026-08-27");
    expect(startOfPage("week", date).isSame(date.startOf("week"))).toBe(true);
    expect(startOfPage("twoWeeks", date).isSame(date.startOf("week"))).toBe(
      true
    );
  });

  it("aligns month mode to the start of the month", () => {
    const date = dayjs("2026-08-27");
    expect(startOfPage("month", date).isSame(date.startOf("month"))).toBe(true);
  });
});

describe("isGridViewMode", () => {
  it("accepts the three known view modes", () => {
    expect(isGridViewMode("week")).toBe(true);
    expect(isGridViewMode("twoWeeks")).toBe(true);
    expect(isGridViewMode("month")).toBe(true);
  });

  it("rejects anything else, including null", () => {
    expect(isGridViewMode(null)).toBe(false);
    expect(isGridViewMode("year")).toBe(false);
    expect(isGridViewMode("")).toBe(false);
  });
});

describe("resolveViewMode", () => {
  it("uses the stored value when it is a valid view mode", () => {
    expect(resolveViewMode("week")).toBe("week");
    expect(resolveViewMode("month")).toBe("month");
  });

  it("falls back to two-weeks when nothing valid is stored", () => {
    expect(resolveViewMode(null)).toBe("twoWeeks");
    expect(resolveViewMode("year")).toBe("twoWeeks");
  });
});
