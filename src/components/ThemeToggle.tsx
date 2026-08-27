import { Moon, Sun } from "lucide-react";
import type { FC } from "react";

import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/button";

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={
        isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"
      }
      onClick={toggleTheme}
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
};
