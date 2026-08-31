import type { Dayjs } from "dayjs";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { FC } from "react";

import type { DayEntry, Habit } from "@/data/types";
import type { GridViewMode } from "@/lib/dayGrid";
import { cn } from "@/lib/utils";

import { HabitDayCells } from "./HabitDayCells";
import { HabitDescriptionCards } from "./HabitDescriptionCards";
import { HabitNameCell } from "./HabitNameCell";

interface HabitRowProps {
  habit: Habit;
  streak: number;
  today: Dayjs;
  dates: Dayjs[];
  viewMode: GridViewMode;
  entriesByDate: Map<string, DayEntry> | undefined;
  onCellClick: (habitId: string, date: string, target: HTMLElement) => void;
  onHide: (habitId: string) => void;
  pageKey: string;
  pageTransitionClass: string;
}

/** One habit's accordion item: the name+day-cells row on top, the
 * description card grid below it when expanded. */
export const HabitRow: FC<HabitRowProps> = ({
  habit,
  streak,
  today,
  dates,
  viewMode,
  entriesByDate,
  onCellClick,
  onHide,
  pageKey,
  pageTransitionClass,
}) => {
  return (
    <AccordionPrimitive.Item value={habit.id}>
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
        <div className="md:w-56 md:shrink-0">
          <HabitNameCell habit={habit} streak={streak} onHide={onHide} />
        </div>

        <div
          key={pageKey}
          className={cn("md:min-w-0 md:flex-1", pageTransitionClass)}
        >
          <HabitDayCells
            habitId={habit.id}
            today={today}
            dates={dates}
            size={viewMode}
            entriesByDate={entriesByDate}
            onCellClick={onCellClick}
          />
        </div>
      </div>

      <AccordionPrimitive.Content className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up">
        <div className="pt-3 pb-1">
          <HabitDescriptionCards description={habit.description} />
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};
