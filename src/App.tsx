import type { FC } from "react";
import { Route, Routes } from "react-router";

import { LoadingScreen } from "./components/LoadingScreen";
import { jsonFileDataStore } from "./data/jsonFileDataStore";
import { useHabitsData } from "./data/useHabitsData";
import { LoginPage } from "./pages/LoginPage";
import { StatsPage } from "./pages/StatsPage";
import { WeekPage } from "./pages/WeekPage";
import { Layout } from "./routes/Layout";
import { RequireAuth } from "./routes/RequireAuth";

const HabitsApp: FC = () => {
  const { data, error, saveEntry, toggleHabitVisibility } =
    useHabitsData(jsonFileDataStore);

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-6xl px-4 text-sm text-destructive md:px-12">
        Не удалось загрузить данные: {error}
      </div>
    );
  }

  if (!data) {
    return <LoadingScreen />;
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

export const App: FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="*" element={<HabitsApp />} />
      </Route>
    </Routes>
  );
};
