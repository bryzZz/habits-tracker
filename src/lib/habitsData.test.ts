import { describe, expect, it } from "vitest";
import type { HabitsData } from "../data/types";
import {
  buildEntriesByHabit,
  overallScoreForDate,
  setHabitVisibility,
} from "./habitsData";
import { entry, habit } from "./testFixtures";

describe("setHabitVisibility", () => {
  it("flips visibility for the matching habit only", () => {
    const data: HabitsData = {
      habits: [habit("h1", true), habit("h2", true)],
      entries: [],
    };
    const next = setHabitVisibility(data, "h1", false);
    expect(next.habits.find((h) => h.id === "h1")?.visible).toBe(false);
    expect(next.habits.find((h) => h.id === "h2")?.visible).toBe(true);
  });

  it("leaves entry history untouched when hiding or re-showing", () => {
    const data: HabitsData = {
      habits: [habit("h1", true)],
      entries: [entry("h1", "2026-08-20", 0.7)],
    };
    const hidden = setHabitVisibility(data, "h1", false);
    expect(hidden.entries).toEqual(data.entries);
    const shown = setHabitVisibility(hidden, "h1", true);
    expect(shown.entries).toEqual(data.entries);
  });
});

describe("overallScoreForDate", () => {
  it("returns undefined for a future date", () => {
    const data: HabitsData = {
      habits: [habit("h1", true)],
      entries: [entry("h1", "2026-08-26", 1)],
    };
    const entriesByHabit = buildEntriesByHabit(data.entries);
    expect(
      overallScoreForDate(data, entriesByHabit, "2026-08-26", "2026-08-25")
    ).toBeUndefined();
  });

  it("counts an unfilled past day as 0 for every visible habit", () => {
    const data: HabitsData = {
      habits: [habit("h1", true), habit("h2", true)],
      entries: [entry("h1", "2026-08-25", 1)],
      // h2 has no entry at all for this date
    };
    const entriesByHabit = buildEntriesByHabit(data.entries);
    expect(
      overallScoreForDate(data, entriesByHabit, "2026-08-25", "2026-08-25")
    ).toBe(0.5);
  });

  it("excludes a hidden habit from the average", () => {
    const data: HabitsData = {
      habits: [habit("h1", true), habit("h2", false)],
      entries: [entry("h1", "2026-08-25", 1), entry("h2", "2026-08-25", 0)],
    };
    const entriesByHabit = buildEntriesByHabit(data.entries);
    expect(
      overallScoreForDate(data, entriesByHabit, "2026-08-25", "2026-08-25")
    ).toBe(1);
  });
});
