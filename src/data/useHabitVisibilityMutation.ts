import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setHabitVisibility } from "../lib/habitsData";
import { supabaseDataStore } from "./supabaseDataStore";
import type { Habit } from "./types";

export const useHabitVisibilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, visible }: { habitId: string; visible: boolean }) =>
      supabaseDataStore.setHabitVisibility(habitId, visible),
    onMutate: ({ habitId, visible }) => {
      queryClient.setQueryData<Habit[]>(["habits"], (prev) =>
        prev ? setHabitVisibility(prev, habitId, visible) : prev
      );
    },
    onError: (err: unknown) => console.error(err),
  });
};
