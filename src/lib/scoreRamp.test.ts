import { describe, expect, it } from "vitest";

import { colorForScore, SCORE_RAMP } from "./scoreRamp";

describe("colorForScore", () => {
  it("maps score 0 to the ramp's red end", () => {
    expect(colorForScore(0)).toBe(SCORE_RAMP[0]);
  });

  it("maps score 1 (displayed as 10) to the ramp's green end", () => {
    expect(colorForScore(1)).toBe(SCORE_RAMP[10]);
  });
});
