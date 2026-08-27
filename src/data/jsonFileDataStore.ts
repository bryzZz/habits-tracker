import type { DataStore } from "./dataStore";
import type { HabitsData } from "./types";

const ENDPOINT = "/api/habits-data";

export const jsonFileDataStore: DataStore = {
  load: async (): Promise<HabitsData> => {
    const res = await fetch(ENDPOINT);
    if (!res.ok) {
      throw new Error(`Failed to load habits data: ${res.status}`);
    }
    return res.json();
  },

  save: async (data: HabitsData): Promise<void> => {
    const res = await fetch(ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Failed to save habits data: ${res.status}`);
    }
  },
};
