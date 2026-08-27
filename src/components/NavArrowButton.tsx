import { ChevronLeft } from "lucide-react";
import type { FC } from "react";

import { Button } from "./ui/button";

interface NavArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export const NavArrowButton: FC<NavArrowButtonProps> = ({
  direction,
  onClick,
}) => {
  return (
    <Button type="button" variant="outline" size="icon" onClick={onClick}>
      <ChevronLeft
        className={"size-4" + (direction === "right" ? " rotate-180" : "")}
      />
    </Button>
  );
};
