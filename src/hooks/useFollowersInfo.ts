import { kyInstance } from "@/lib/ky";
import { UserFollowersInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowersInfo(
  userId: string,
  initialState: UserFollowersInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`users/${userId}/followers`).json<UserFollowersInfo>(),
    placeholderData: initialState,
    staleTime: Infinity,
  });

  return query;
}
