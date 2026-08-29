import { useQuery } from "@tanstack/react-query";

import { supabaseDataStore } from "./supabaseDataStore";

export const useGetHabits = () =>
  useQuery({
    queryKey: ["habits"],
    queryFn: () => supabaseDataStore.loadHabits(),
  });
