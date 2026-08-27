import type { FC } from "react";

export const LoadingScreen: FC = () => {
  return (
    <div className="flex justify-center py-24 text-sm text-muted-foreground">
      Загрузка…
    </div>
  );
};
