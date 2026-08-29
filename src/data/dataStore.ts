import type { DateRange, DayEntry, Habit } from "./types";

export interface HabitStreaks {
  currentStreak: number;
  bestStreak: number;
}

/** The seam ADR-0004/0012 name as what a Supabase-backed implementation
 * fulfills — components/hooks only ever go through this. */
export interface DataStore {
  loadHabits(): Promise<Habit[]>;
  loadEntries(range: DateRange): Promise<DayEntry[]>;
  loadStreaks(habitId: string): Promise<HabitStreaks>;
  saveEntry(entry: DayEntry): Promise<void>;
  setHabitVisibility(habitId: string, visible: boolean): Promise<void>;
}
