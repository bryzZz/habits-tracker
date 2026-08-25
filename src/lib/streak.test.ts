import { describe, expect, it } from "vitest";

import { calculateBestStreak, calculateStreak } from "./streak";
import { entry } from "./testFixtures";

describe("calculateStreak", () => {
  it("counts consecutive days with score > 0 walking back from today", () => {
    const entries = [
      entry("h1", "2026-08-25", 1),
      entry("h1", "2026-08-24", 0.5),
      entry("h1", "2026-08-23", 1),
      entry("h1", "2026-08-22", 0),
    ];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(3);
  });

  it("treats an unfilled past day as score 0 and breaks the streak", () => {
    const entries = [
      entry("h1", "2026-08-25", 1),
      // 2026-08-24 has no entry at all
      entry("h1", "2026-08-23", 1),
    ];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(1);
  });

  it("keeps the streak alive on a partial, non-zero score", () => {
    const entries = [
      entry("h1", "2026-08-25", 0.1),
      entry("h1", "2026-08-24", 1),
    ];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(2);
  });

  it("does not break the streak when today is unfilled, but skips it", () => {
    const entries = [
      entry("h1", "2026-08-24", 1),
      entry("h1", "2026-08-23", 1),
    ];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(2);
  });

  it("returns 0 when today is unfilled and yesterday broke the streak", () => {
    const entries = [entry("h1", "2026-08-23", 1)];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(0);
  });

  it("ignores entries for other habits", () => {
    const entries = [
      entry("h1", "2026-08-25", 1),
      entry("h2", "2026-08-24", 1),
    ];
    const today = new Date("2026-08-25T00:00:00");
    expect(calculateStreak(entries, "h1", today)).toBe(1);
  });
});

describe("calculateBestStreak", () => {
  it("returns 0 for a habit with no entries", () => {
    expect(calculateBestStreak([], "h1")).toBe(0);
  });

  it("finds the longest run across a gap in the habit's history", () => {
    const entries = [
      entry("h1", "2026-08-01", 1),
      entry("h1", "2026-08-02", 1),
      // gap on 2026-08-03: counts as 0, breaks the run
      entry("h1", "2026-08-04", 1),
      entry("h1", "2026-08-05", 1),
      entry("h1", "2026-08-06", 1),
    ];
    expect(calculateBestStreak(entries, "h1")).toBe(3);
  });

  it("treats a score of exactly 0 as breaking the run", () => {
    const entries = [
      entry("h1", "2026-08-01", 1),
      entry("h1", "2026-08-02", 0),
      entry("h1", "2026-08-03", 1),
    ];
    expect(calculateBestStreak(entries, "h1")).toBe(1);
  });

  it("handles a habit with a single recorded entry", () => {
    const entries = [entry("h1", "2026-08-10", 1)];
    expect(calculateBestStreak(entries, "h1")).toBe(1);
  });
});
