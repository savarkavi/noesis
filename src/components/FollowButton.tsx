"use client";

import useFollowersInfo from "@/hooks/useFollowersInfo";
import { kyInstance } from "@/lib/ky";
import { UserFollowersInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const FollowButton = ({
  userId,
  initialState,
}: {
  userId: string;
  initialState: UserFollowersInfo;
}) => {
  const { data } = useFollowersInfo(userId, initialState);

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isFollowed
        ? kyInstance.delete(`users/${userId}/followers`)
        : kyInstance.post(`users/${userId}/followers`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<UserFollowersInfo>(queryKey);

      queryClient.setQueryData<UserFollowersInfo>(queryKey, () => ({
        totalFollowers:
          (previousState?.totalFollowers || 0) +
          (previousState?.isFollowed ? -1 : 1),
        isFollowed: !previousState?.isFollowed,
      }));

      return { previousState };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.log(error);
      toast.error("Something went wrong.");
    },
  });

  return (
    <button
      className={cn(
        "w-24 cursor-pointer rounded-2xl px-4 py-2 text-sm",
        data?.isFollowed ? "bg-white text-black" : "bg-blue-500 text-white",
      )}
      onClick={() => mutate()}
    >
      {data?.isFollowed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
