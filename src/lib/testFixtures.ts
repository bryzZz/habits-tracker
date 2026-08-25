import type { DayEntry, Habit } from "../data/types";
import { LOCAL_USER_ID } from "../data/types";

export function habit(id: string, visible: boolean): Habit {
  return {
    id,
    userId: LOCAL_USER_ID,
    name: id,
    priority: "priority",
    visible,
    quickAnswers: [],
  };
}

export function entry(habitId: string, date: string, score: number): DayEntry {
  return { habitId, userId: LOCAL_USER_ID, date, note: "", score };
}
