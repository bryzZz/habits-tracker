import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface NavArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export function NavArrowButton({ direction, onClick }: NavArrowButtonProps) {
  return (
    <Button type="button" variant="outline" size="icon" onClick={onClick}>
      <ChevronLeft
        className={"h-4 w-4" + (direction === "right" ? " rotate-180" : "")}
      />
    </Button>
  );
}
