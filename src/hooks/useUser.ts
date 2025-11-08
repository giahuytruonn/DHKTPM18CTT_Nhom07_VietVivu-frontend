import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/user.servie";
import type { UserResponse } from "../types/user";
import { QUERY_KEYS } from "../utils/queryKeys";

export const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserResponse>({
    queryKey: QUERY_KEYS.USER,
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 2,
  });

  return { user, isLoading, isError, refetch };
};
