// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/user.service";
import type { UserResponse } from "../types/user";
import { QUERY_KEYS } from "../utils/queryKeys";
import { useAuthStore } from "../stores/useAuthStore";

export const useUser = () => {
  const { authenticated } = useAuthStore();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserResponse>({
    queryKey: QUERY_KEYS.USER,
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 2,
    enabled: authenticated, // Chỉ fetch khi đã đăng nhập
    retry: false,
  });

  return { user, isLoading, isError, refetch };
};