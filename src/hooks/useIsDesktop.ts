import { useSyncExternalStore } from "react";

/** Tailwind's default `md` breakpoint — the app's one mobile/desktop split. */
const DESKTOP_QUERY = "(min-width: 48rem)";

const subscribe = (listener: () => void) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", listener);

  return () => media.removeEventListener("change", listener);
};

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;

export const useIsDesktop = () => useSyncExternalStore(subscribe, getSnapshot);
