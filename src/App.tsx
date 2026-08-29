import type { FC } from "react";
import { Route, Routes } from "react-router";

import { LoginPage } from "./pages/LoginPage";
import { StatsPage } from "./pages/StatsPage";
import { WeekPage } from "./pages/WeekPage";
import { Layout } from "./routes/Layout";
import { RequireAuth } from "./routes/RequireAuth";

export const App: FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<WeekPage />} />

          <Route path="stats" element={<StatsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
