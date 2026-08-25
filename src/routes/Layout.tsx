import { NavLink, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen">
      <nav className="border-border flex justify-center gap-1 border-b py-3">
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
}
