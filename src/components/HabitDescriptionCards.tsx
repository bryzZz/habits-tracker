import type { FC } from "react";

import type { HabitDescriptionField } from "@/data/types";

interface HabitDescriptionCardsProps {
  description: HabitDescriptionField[];
}

export const HabitDescriptionCards: FC<HabitDescriptionCardsProps> = ({
  description,
}) => {
  if (description.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Описание пока не заполнено.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
      {description.map((field) => (
        <div
          key={field.title}
          className="flex flex-col gap-1 rounded-xl bg-muted/50 p-3"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {field.title}
          </span>

          <span className="text-sm text-foreground">{field.text}</span>
        </div>
      ))}
    </div>
  );
};
