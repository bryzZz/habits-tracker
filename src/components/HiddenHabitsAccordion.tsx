import { Eye } from "lucide-react";
import type { FC } from "react";

import type { Habit } from "../data/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

interface HiddenHabitsAccordionProps {
  hiddenHabits: Habit[];
  onShow: (habitId: string) => void;
}

export const HiddenHabitsAccordion: FC<HiddenHabitsAccordionProps> = ({
  hiddenHabits,
  onShow,
}) => {
  if (hiddenHabits.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="mt-7 mb-7">
      <AccordionItem value="hidden" className="border-b-0">
        <AccordionTrigger className="items-center rounded-md px-3.5 py-2 hover:no-underline">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-sm font-semibold text-muted-foreground">
              Скрытые привычки
            </span>

            <span className="text-xs text-muted-foreground">
              {hiddenHabits.length}
            </span>
          </span>
        </AccordionTrigger>

        <AccordionContent className="pb-0">
          <div className="flex flex-col gap-1">
            {hiddenHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between rounded-lg px-1 py-1.5"
              >
                <span className="text-sm font-medium text-ink-secondary">
                  {habit.name}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onShow(habit.id)}
                >
                  <Eye className="size-3.5" />
                  Показать
                </Button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
