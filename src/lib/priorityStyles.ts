import type { PriorityId } from "../data/types";

export const PRIORITY_COLOR: Record<PriorityId, string> = {
  priority: "#d95926",
  active: "#008300",
  paused: "#898781",
};

export const PRIORITY_TINT: Record<PriorityId, string> = {
  priority: "rgba(217,89,38,0.08)",
  active: "rgba(0,131,0,0.08)",
  paused: "rgba(137,135,129,0.06)",
};
