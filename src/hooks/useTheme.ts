import { useCallback, useSyncExternalStore } from "react";

import {
  applyTheme,
  getDarkSchemeMediaQuery,
  getInitialTheme,
  isExplicitTheme,
  readStoredTheme,
  type Theme,
  THEME_STORAGE_KEY,
  writeStoredTheme,
} from "../lib/theme";

let currentTheme: Theme = getInitialTheme();

const listeners = new Set<() => void>();

const setTheme = (theme: Theme) => {
  currentTheme = theme;
  writeStoredTheme(theme);
  applyTheme(theme);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  // Fires only in *other* tabs than the one that wrote localStorage, which is
  // exactly the cross-tab sync we want on top of the same-tab notify above.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;

    const stored = readStoredTheme();
    if (isExplicitTheme(stored)) {
      currentTheme = stored;
      applyTheme(currentTheme);
      listener();
    }
  };

  // Keeps following the OS preference live for as long as the user hasn't
  // pinned an explicit choice; ignored once they have.
  const media = getDarkSchemeMediaQuery();
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (isExplicitTheme(readStoredTheme())) return;

    currentTheme = event.matches ? "dark" : "light";
    applyTheme(currentTheme);
    listener();
  };

  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
};

const getSnapshot = () => currentTheme;

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return { theme, toggleTheme };
};
