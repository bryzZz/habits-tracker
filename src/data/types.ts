export type PriorityId = "priority" | "active" | "paused";

export interface QuickAnswer {
  text: string;
  score: number; // 0..1
}

export interface Habit {
  id: string;
  name: string;
  priority: PriorityId;
  visible: boolean;
  quickAnswers: QuickAnswer[];
}

export interface DayEntry {
  habitId: string;
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
