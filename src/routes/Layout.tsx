import type { FC } from "react";
import { NavLink, Outlet } from "react-router";

import { ThemeToggle } from "../components/ThemeToggle";
import { cn } from "../lib/utils";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-4 py-1.5 text-sm font-semibold",
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
  );

export const Layout: FC = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <nav className="fixed inset-x-0 bottom-0 flex justify-center gap-1 border-t border-border bg-background py-3 md:relative md:inset-auto md:border-t-0 md:border-b">
        <NavLink to="/" end className={navLinkClassName}>
          Неделя
        </NavLink>

        <NavLink to="/stats" className={navLinkClassName}>
          Статистика
        </NavLink>

        <div className="absolute top-3 left-4 md:right-4 md:left-auto">
          <ThemeToggle />
        </div>
      </nav>

      <Outlet />
    </div>
  );
};
