import { describe, expect, it } from "vitest";

import { isExplicitTheme, resolveTheme } from "./theme";

describe("isExplicitTheme", () => {
  it("accepts only the two explicit theme values", () => {
    expect(isExplicitTheme("light")).toBe(true);
    expect(isExplicitTheme("dark")).toBe(true);
  });

  it("rejects anything else, including null", () => {
    expect(isExplicitTheme(null)).toBe(false);
    expect(isExplicitTheme("system")).toBe(false);
    expect(isExplicitTheme("")).toBe(false);
  });
});

describe("resolveTheme", () => {
  it("uses the stored theme when it is a valid explicit value", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to the system preference when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("falls back to the system preference when the stored value is invalid", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("", false)).toBe("light");
  });
});
