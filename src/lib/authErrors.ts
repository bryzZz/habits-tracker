const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Неверный email или пароль.",
  "Email not confirmed": "Аккаунт не подтверждён.",
};

const FALLBACK_MESSAGE =
  "Не удалось войти. Проверьте подключение и попробуйте снова.";

export const getAuthErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) return FALLBACK_MESSAGE;
  return KNOWN_MESSAGES[error.message] ?? FALLBACK_MESSAGE;
};
