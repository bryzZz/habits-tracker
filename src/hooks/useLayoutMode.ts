import { useState } from "react";

import {
  type LayoutMode,
  readStoredLayoutMode,
  writeStoredLayoutMode,
} from "@/lib/dayTable";

/** Grid/table display mode for the week screen, persisted like `viewMode`
 * (see `useDayGrid`) — a separate axis from the grid's own week/month paging. */
export const useLayoutMode = () => {
  const [layoutMode, setLayoutModeState] =
    useState<LayoutMode>(readStoredLayoutMode);

  const setLayoutMode = (mode: LayoutMode) => {
    writeStoredLayoutMode(mode);
    setLayoutModeState(mode);
  };

  return { layoutMode, setLayoutMode };
};
