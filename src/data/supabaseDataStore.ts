import dayjs from "dayjs";

import { toISODate } from "../lib/dates";
import { supabase } from "../lib/supabaseClient";
import type { DataStore, HabitStreaks } from "./dataStore";
import type {
  DateRange,
  DayEntry,
  Habit,
  HabitDescriptionField,
  PriorityId,
  QuickAnswer,
} from "./types";

interface DescriptionRow {
  title: string;
  text: string;
  order: number;
}

interface HabitRow {
  id: string;
  name: string;
  priority: PriorityId;
  visible: boolean;
  quick_answers: QuickAnswer[];
  habit_descriptions: DescriptionRow[];
}

const toDescription = (rows: DescriptionRow[]): HabitDescriptionField[] =>
  rows
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((row) => ({ title: row.title, text: row.text }));

interface EntryRow {
  habit_id: string;
  date: string;
  score: number;
  note: string;
}

interface StreaksRow {
  current_streak: number;
  best_streak: number;
}

const unwrap = <T>(
  result: { data: T | null; error: { message: string } | null },
  action: string
): T => {
  if (result.error) {
    throw new Error(`Failed to ${action}: ${result.error.message}`);
  }
  return result.data as T;
};

export const supabaseDataStore: DataStore = {
  loadHabits: async (): Promise<Habit[]> => {
    const rows = unwrap(
      await supabase
        .from("habits")
        .select(
          "id, name, priority, visible, quick_answers(text, score), habit_descriptions(title, text, order)"
        ),
      "load habits"
    ) as HabitRow[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      priority: row.priority,
      visible: row.visible,
      quickAnswers: row.quick_answers,
      description: toDescription(row.habit_descriptions),
    }));
  },

  loadEntries: async (range: DateRange): Promise<DayEntry[]> => {
    const rows = unwrap(
      await supabase
        .from("entries")
        .select("habit_id, date, score, note")
        .gte("date", toISODate(range.start))
        .lte("date", toISODate(range.end)),
      "load entries"
    ) as EntryRow[];

    return rows.map((row) => ({
      habitId: row.habit_id,
      date: row.date,
      score: row.score,
      note: row.note,
    }));
  },

  loadStreaks: async (habitId: string): Promise<HabitStreaks> => {
    const rows = unwrap(
      await supabase.rpc("get_habit_streaks", {
        p_habit_id: habitId,
        p_today: toISODate(dayjs()),
      }),
      "load streaks"
    ) as StreaksRow[] | null;

    const row = rows?.[0];
    return {
      currentStreak: row?.current_streak ?? 0,
      bestStreak: row?.best_streak ?? 0,
    };
  },

  saveEntry: async (entry: DayEntry): Promise<void> => {
    unwrap(
      await supabase.from("entries").upsert(
        {
          habit_id: entry.habitId,
          date: entry.date,
          score: entry.score,
          note: entry.note,
        },
        { onConflict: "user_id,habit_id,date" }
      ),
      "save entry"
    );
  },

  setHabitVisibility: async (
    habitId: string,
    visible: boolean
  ): Promise<void> => {
    unwrap(
      await supabase.from("habits").update({ visible }).eq("id", habitId),
      "update habit visibility"
    );
  },
};
