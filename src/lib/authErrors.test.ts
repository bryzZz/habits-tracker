import { describe, expect, it } from "vitest";

import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("maps wrong credentials to a Russian message", () => {
    expect(getAuthErrorMessage(new Error("Invalid login credentials"))).toBe(
      "Неверный email или пароль."
    );
  });

  it("maps an unconfirmed account to a Russian message", () => {
    expect(getAuthErrorMessage(new Error("Email not confirmed"))).toBe(
      "Аккаунт не подтверждён."
    );
  });

  it("falls back to a generic message for an unrecognized error", () => {
    expect(getAuthErrorMessage(new Error("Failed to fetch"))).toBe(
      "Не удалось войти. Проверьте подключение и попробуйте снова."
    );
  });

  it("falls back to a generic message for a non-Error value", () => {
    expect(getAuthErrorMessage(undefined)).toBe(
      "Не удалось войти. Проверьте подключение и попробуйте снова."
    );
    expect(getAuthErrorMessage("some string")).toBe(
      "Не удалось войти. Проверьте подключение и попробуйте снова."
    );
  });
});
