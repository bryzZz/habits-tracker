import type { FC } from "react";
import { Route, Routes } from "react-router";

import { jsonFileDataStore } from "./data/jsonFileDataStore";
import { useHabitsData } from "./data/useHabitsData";
import { StatsPage } from "./pages/StatsPage";
import { WeekPage } from "./pages/WeekPage";
import { Layout } from "./routes/Layout";

export const App: FC = () => {
  const { data, error, saveEntry, toggleHabitVisibility } =
    useHabitsData(jsonFileDataStore);

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-6xl px-12 text-sm text-[#e34948]">
        Не удалось загрузить данные: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center py-24 text-sm text-ink-muted">
        Загрузка…
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <WeekPage
              data={data}
              onSaveEntry={saveEntry}
              onToggleVisibility={toggleHabitVisibility}
            />
          }
        />

        <Route path="stats" element={<StatsPage data={data} />} />
      </Route>
    </Routes>
  );
};
