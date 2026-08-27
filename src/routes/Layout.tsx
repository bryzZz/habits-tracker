import type { FC } from "react";
import { NavLink, Outlet } from "react-router";

import { cn } from "../lib/utils";

export const Layout: FC = () => {
  return (
    <div className="min-h-screen">
      <nav className="flex justify-center gap-1 border-b border-border py-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          Неделя
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          Статистика
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
