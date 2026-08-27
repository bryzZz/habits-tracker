export type Theme = "light" | "dark";

// Kept in sync by hand with the FOUC-prevention inline script in index.html,
// which can't import this constant.
export const THEME_STORAGE_KEY = "theme";

export const isExplicitTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

export const resolveTheme = (
  stored: string | null,
  prefersDark: boolean
): Theme => {
  if (isExplicitTheme(stored)) return stored;

  return prefersDark ? "dark" : "light";
};

export const readStoredTheme = (): string | null =>
  localStorage.getItem(THEME_STORAGE_KEY);

export const writeStoredTheme = (theme: Theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const getDarkSchemeMediaQuery = (): MediaQueryList =>
  window.matchMedia("(prefers-color-scheme: dark)");

export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const getInitialTheme = (): Theme =>
  resolveTheme(readStoredTheme(), getDarkSchemeMediaQuery().matches);
