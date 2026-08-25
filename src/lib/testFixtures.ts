import type { DayEntry, Habit } from "../data/types";

export function habit(id: string, visible: boolean): Habit {
  return { id, name: id, priority: "priority", visible, quickAnswers: [] };
}

export function entry(habitId: string, date: string, score: number): DayEntry {
  return { habitId, date, note: "", score };
}
