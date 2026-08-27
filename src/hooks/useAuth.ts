import type { Session } from "@supabase/supabase-js";
import { useCallback, useSyncExternalStore } from "react";

import { supabase } from "../lib/supabaseClient";

type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; session: Session };

let state: AuthState = { status: "loading" };

const listeners = new Set<() => void>();

// One subscription for the whole app — every useAuth() call shares it,
// same module-singleton shape as useTheme.
supabase.auth.onAuthStateChange((_event, session) => {
  state = session ? { status: "signed-in", session } : { status: "signed-out" };
  listeners.forEach((listener) => listener());
});

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useAuth = () => {
  const authState = useSyncExternalStore(subscribe, getSnapshot);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  }, []);

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  return { ...authState, signIn, signOut };
};
