import { LogOut } from "lucide-react";
import type { FC } from "react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";

export const SignOutButton: FC = () => {
  const { signOut } = useAuth();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Выйти"
      onClick={() => void signOut()}
    >
      <LogOut />
    </Button>
  );
};
