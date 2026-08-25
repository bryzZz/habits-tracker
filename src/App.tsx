import { Route, Routes } from "react-router";
import { jsonFileDataStore } from "./data/jsonFileDataStore";
import { useHabitsData } from "./data/useHabitsData";
import { StatsPage } from "./pages/StatsPage";
import { WeekPage } from "./pages/WeekPage";
import { Layout } from "./routes/Layout";

function App() {
  const { data, error, saveEntry } = useHabitsData(jsonFileDataStore);

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-6xl px-12 text-sm text-[#e34948]">
        Не удалось загрузить данные: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-ink-muted flex justify-center py-24 text-sm">
        Загрузка…
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={<WeekPage data={data} onSaveEntry={saveEntry} />}
        />
        <Route path="stats" element={<StatsPage data={data} />} />
      </Route>
    </Routes>
  );
}

export default App;
