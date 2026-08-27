import type { HabitsData } from "./types";

/** The seam ADR-0004 names as what gets replaced by a Supabase-backed
 * implementation later — components/hooks only ever go through this. */
export interface DataStore {
  load(): Promise<HabitsData>;
  save(data: HabitsData): Promise<void>;
}
