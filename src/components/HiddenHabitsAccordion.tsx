import { Eye } from "lucide-react";

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

export function HiddenHabitsAccordion({
  hiddenHabits,
  onShow,
}: HiddenHabitsAccordionProps) {
  if (hiddenHabits.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="mt-7 mb-7">
      <AccordionItem value="hidden" className="border-b-0">
        <AccordionTrigger className="items-center rounded-[9px] px-3.5 py-2 hover:no-underline">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-ink-muted text-sm font-semibold">
              Скрытые привычки
            </span>
            <span className="text-ink-muted text-xs">
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
                <span className="text-ink-secondary text-sm font-medium">
                  {habit.name}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onShow(habit.id)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Показать
                </Button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
