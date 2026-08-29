import type { FC, ReactNode } from "react";

import { LoadingScreen } from "@/components/LoadingScreen";

interface QueryBoundaryProps {
  isLoading: boolean;
  error?: Error | null;
  children: ReactNode;
}

export const QueryBoundary: FC<QueryBoundaryProps> = ({
  isLoading,
  error,
  children,
}) => {
  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-6xl px-4 text-sm text-destructive md:px-12">
        Не удалось загрузить данные: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
