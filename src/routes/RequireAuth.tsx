import type { FC } from "react";
import { Navigate, Outlet } from "react-router";

import { LoadingScreen } from "../components/LoadingScreen";
import { useAuth } from "../hooks/useAuth";

export const RequireAuth: FC = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "signed-out") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
