import type { FC } from "react";
import { NavLink, Outlet } from "react-router";

export const Layout: FC = () => {
  return (
    <div className="min-h-screen">
      <nav className="flex justify-center gap-1 border-b border-border py-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "rounded-lg px-4 py-1.5 text-sm font-semibold " +
            (isActive ? "bg-surface text-ink" : "text-ink-muted")
          }
        >
          Неделя
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            "rounded-lg px-4 py-1.5 text-sm font-semibold " +
            (isActive ? "bg-surface text-ink" : "text-ink-muted")
          }
        >
          Статистика
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
