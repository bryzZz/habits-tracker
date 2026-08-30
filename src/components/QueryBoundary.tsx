import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";

/** Below this, a fetch's own loading fallback never appears — avoids a
 * flash of skeleton on fast responses (see ADR-0014). */
const LOADING_FALLBACK_DELAY_MS = 250;

interface QueryBoundaryProps {
  isLoading: boolean;
  error?: Error | null;
  loadingFallback: ReactNode;
  children: ReactNode;
}

export const QueryBoundary: FC<QueryBoundaryProps> = ({
  isLoading,
  error,
  loadingFallback,
  children,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [trackedIsLoading, setTrackedIsLoading] = useState(isLoading);

  // Resets the fallback the instant a load finishes, without a
  // setState-in-effect round trip (react.dev/learn/you-might-not-need-an-effect).
  if (isLoading !== trackedIsLoading) {
    setTrackedIsLoading(isLoading);
    if (!isLoading) setShowFallback(false);
  }

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(
      () => setShowFallback(true),
      LOADING_FALLBACK_DELAY_MS
    );

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-6xl px-4 text-sm text-destructive md:px-12">
        Не удалось загрузить данные: {error.message}
      </div>
    );
  }

  if (isLoading) return showFallback ? <>{loadingFallback}</> : null;

  return <>{children}</>;
};
