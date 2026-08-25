export type PriorityId = "priority" | "active" | "paused";

// Single-user prototype (see ADR-0004) — carried on every row so the future
// Supabase tables have a `user_id` column to filter by in RLS policies
// without a schema/type shape change.
export const LOCAL_USER_ID = "local-user";

export interface QuickAnswer {
  text: string;
  score: number; // 0..1
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  priority: PriorityId;
  visible: boolean;
  quickAnswers: QuickAnswer[];
}

export interface DayEntry {
  habitId: string;
  userId: string;
  date: string; // ISO yyyy-mm-dd
  score: number; // 0..1
  note: string;
}

export interface HabitsData {
  habits: Habit[];
  entries: DayEntry[];
}

export const PRIORITY_ORDER: PriorityId[] = ["priority", "active", "paused"];

export const PRIORITY_LABELS: Record<PriorityId, string> = {
  priority: "Приоритет",
  active: "Работает",
  paused: "На паузе",
};
