import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  blockContentWidth,
  blockSlotWidth,
  blockStartForIndex,
  CELL_PX,
  datesInBlock,
  dayCountForIndex,
  indexForDate,
  indexForOffset,
  offsetForIndex,
  originBlockStart,
  originIndex,
  totalBlocks,
} from "./dayGrid";

describe("datesInBlock", () => {
  it("returns 7 consecutive ISO dates for a week block", () => {
    const start = dayjs("2026-08-24"); // Monday
    expect(datesInBlock("week", start)).toEqual([
      "2026-08-24",
      "2026-08-25",
      "2026-08-26",
      "2026-08-27",
      "2026-08-28",
      "2026-08-29",
      "2026-08-30",
    ]);
  });

  it("returns every day of the month for a month block, including leap February", () => {
    expect(datesInBlock("month", dayjs("2028-02-01"))).toHaveLength(29);
    expect(datesInBlock("month", dayjs("2026-02-01"))).toHaveLength(28);
    expect(datesInBlock("month", dayjs("2026-01-01"))).toHaveLength(31);
    expect(datesInBlock("month", dayjs("2026-01-01"))[30]).toBe("2026-01-31");
  });
});

describe("originBlockStart", () => {
  it("floors a week-mode origin to the locale's week start", () => {
    // 2026-08-26 is a Wednesday; ru locale weeks start Monday
    expect(originBlockStart("week", dayjs("2026-08-26")).format()).toBe(
      dayjs("2026-08-24").startOf("day").format()
    );
  });

  it("floors a month-mode origin to the 1st of the month", () => {
    expect(originBlockStart("month", dayjs("2026-08-26")).format()).toBe(
      dayjs("2026-08-01").startOf("day").format()
    );
  });
});

describe("blockStartForIndex / indexForDate round-trip", () => {
  it("origin index maps back to the origin block start", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    expect(
      blockStartForIndex("week", origin, originIndex("week")).isSame(
        origin,
        "day"
      )
    ).toBe(true);
  });

  it("week blocks step 7 days per index", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    const idx = originIndex("week");
    expect(
      blockStartForIndex("week", origin, idx + 1).format("YYYY-MM-DD")
    ).toBe("2026-08-31");
    expect(
      blockStartForIndex("week", origin, idx - 1).format("YYYY-MM-DD")
    ).toBe("2026-08-17");
  });

  it("month blocks step 1 calendar month per index", () => {
    const origin = originBlockStart("month", dayjs("2026-08-26"));
    const idx = originIndex("month");
    expect(
      blockStartForIndex("month", origin, idx + 1).format("YYYY-MM-DD")
    ).toBe("2026-09-01");
    expect(
      blockStartForIndex("month", origin, idx - 5).format("YYYY-MM-DD")
    ).toBe("2026-03-01");
  });

  it("indexForDate is the inverse of blockStartForIndex across a year boundary", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    for (const offset of [-60, -1, 0, 1, 60]) {
      const idx = originIndex("week") + offset;
      const start = blockStartForIndex("week", origin, idx);
      expect(indexForDate("week", origin, start.add(3, "day"))).toBe(idx);
    }
  });

  it("indexForDate is the inverse of blockStartForIndex for months", () => {
    const origin = originBlockStart("month", dayjs("2026-08-26"));
    for (const offset of [-13, -1, 0, 1, 13]) {
      const idx = originIndex("month") + offset;
      const start = blockStartForIndex("month", origin, idx);
      expect(indexForDate("month", origin, start.add(10, "day"))).toBe(idx);
    }
  });
});

describe("blockContentWidth / blockSlotWidth", () => {
  it("sums cell widths plus inter-cell gaps for a week (7 cells)", () => {
    expect(blockContentWidth("week", 7)).toBe(7 * CELL_PX.week + 6 * 4);
  });

  it("sums cell widths plus inter-cell gaps for a 31-day month", () => {
    expect(blockContentWidth("month", 31)).toBe(31 * CELL_PX.month + 30 * 4);
  });

  it("slot width is content width plus a fixed inter-block gap", () => {
    const content = blockContentWidth("week", 7);
    expect(blockSlotWidth("week", 7)).toBeGreaterThan(content);
  });
});

describe("dayCountForIndex", () => {
  it("is always 7 for week blocks", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    expect(dayCountForIndex("week", origin, originIndex("week") + 5)).toBe(7);
  });

  it("matches the target month's day count for month blocks", () => {
    const origin = originBlockStart("month", dayjs("2026-08-26"));
    // origin + 6 months = 2027-02, a non-leap February
    expect(dayCountForIndex("month", origin, originIndex("month") + 6)).toBe(
      28
    );
  });
});

describe("offsetForIndex / indexForOffset round-trip", () => {
  it("week offsets are a flat multiple of the (uniform) block slot width", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    expect(offsetForIndex("week", origin, 0)).toBe(0);
    expect(offsetForIndex("week", origin, 5)).toBe(
      5 * blockSlotWidth("week", 7)
    );
  });

  it("month offsets are a prefix sum of each block's (variable) slot width", () => {
    const origin = originBlockStart("month", dayjs("2026-08-26"));
    const idx = originIndex("month");
    const originWidth = blockSlotWidth(
      "month",
      dayCountForIndex("month", origin, idx)
    );
    expect(offsetForIndex("month", origin, idx + 1)).toBe(
      offsetForIndex("month", origin, idx) + originWidth
    );
  });

  it("indexForOffset inverts offsetForIndex at each block's exact start, for both view modes", () => {
    for (const mode of ["week", "month"] as const) {
      const origin = originBlockStart(mode, dayjs("2026-08-26"));
      for (const index of [0, 1, originIndex(mode), originIndex(mode) + 7]) {
        const offset = offsetForIndex(mode, origin, index);
        expect(indexForOffset(mode, origin, offset)).toBe(index);
      }
    }
  });
});

describe("totalBlocks / originIndex", () => {
  it("origin sits in the middle of the range for both view modes", () => {
    for (const mode of ["week", "month"] as const) {
      const total = totalBlocks(mode);
      const idx = originIndex(mode);
      expect(total % 2).toBe(1);
      expect(idx).toBe((total - 1) / 2);
    }
  });

  it("covers at least 5 years in both directions", () => {
    const origin = originBlockStart("week", dayjs("2026-08-26"));
    const fiveYearsOut = origin.add(5, "year");
    const idx = indexForDate("week", origin, fiveYearsOut);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(totalBlocks("week"));

    const monthOrigin = originBlockStart("month", dayjs("2026-08-26"));
    const monthIdx = indexForDate(
      "month",
      monthOrigin,
      monthOrigin.add(5, "year")
    );
    expect(monthIdx).toBeGreaterThanOrEqual(0);
    expect(monthIdx).toBeLessThan(totalBlocks("month"));
  });
});
