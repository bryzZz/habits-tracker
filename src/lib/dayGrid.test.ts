import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { datesInPage, pageStartFor, stepPage, WEEK_PAGE_DAYS } from "./dayGrid";

describe("datesInPage", () => {
  it("returns 7 consecutive ISO dates for a mobile week page", () => {
    const start = dayjs("2026-08-24"); // Monday
    expect(datesInPage("week", start, WEEK_PAGE_DAYS.mobile)).toEqual([
      "2026-08-24",
      "2026-08-25",
      "2026-08-26",
      "2026-08-27",
      "2026-08-28",
      "2026-08-29",
      "2026-08-30",
    ]);
  });

  it("returns 14 consecutive ISO dates for a desktop week page", () => {
    const start = dayjs("2026-08-24");
    const dates = datesInPage("week", start, WEEK_PAGE_DAYS.desktop);
    expect(dates).toHaveLength(14);
    expect(dates[0]).toBe("2026-08-24");
    expect(dates[13]).toBe("2026-09-06");
  });

  it("returns every day of the month for a month page, including leap February", () => {
    expect(datesInPage("month", dayjs("2028-02-01"), 7)).toHaveLength(29);
    expect(datesInPage("month", dayjs("2026-02-01"), 7)).toHaveLength(28);
    expect(datesInPage("month", dayjs("2026-01-01"), 7)).toHaveLength(31);
    expect(datesInPage("month", dayjs("2026-01-01"), 7)[30]).toBe("2026-01-31");
  });
});

describe("pageStartFor", () => {
  it("floors a week-mode start to the locale's week start", () => {
    // 2026-08-26 is a Wednesday; ru locale weeks start Monday
    expect(pageStartFor("week", dayjs("2026-08-26")).format()).toBe(
      dayjs("2026-08-24").startOf("day").format()
    );
  });

  it("floors a month-mode start to the 1st of the month", () => {
    expect(pageStartFor("month", dayjs("2026-08-26")).format()).toBe(
      dayjs("2026-08-01").startOf("day").format()
    );
  });
});

describe("stepPage", () => {
  it("steps a mobile week page by 7 days", () => {
    const start = pageStartFor("week", dayjs("2026-08-26"));
    expect(
      stepPage("week", start, 1, WEEK_PAGE_DAYS.mobile).format("YYYY-MM-DD")
    ).toBe("2026-08-31");
    expect(
      stepPage("week", start, -1, WEEK_PAGE_DAYS.mobile).format("YYYY-MM-DD")
    ).toBe("2026-08-17");
  });

  it("steps a desktop week page by 14 days", () => {
    const start = pageStartFor("week", dayjs("2026-08-26"));
    expect(
      stepPage("week", start, 1, WEEK_PAGE_DAYS.desktop).format("YYYY-MM-DD")
    ).toBe("2026-09-07");
  });

  it("steps a month page by 1 calendar month, independent of weekPageDays", () => {
    const start = pageStartFor("month", dayjs("2026-08-26"));
    expect(stepPage("month", start, 1, 7).format("YYYY-MM-DD")).toBe(
      "2026-09-01"
    );
    expect(stepPage("month", start, -1, 7).format("YYYY-MM-DD")).toBe(
      "2026-07-01"
    );
  });
});
