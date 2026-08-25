import type { HabitsData } from "./types";

/**
 * The only seam ADR-0004 names as what gets replaced by a Supabase-backed
 * implementation later — components and hooks only ever go through this.
 */
export interface DataStore {
  load(): Promise<HabitsData>;
  save(data: HabitsData): Promise<void>;
}
