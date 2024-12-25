"use client";

import { kyInstance } from "@/lib/ky";
import { PostLikesInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const LikeButton = ({
  postId,
  initialState,
}: {
  postId: string;
  initialState: PostLikesInfo;
}) => {
  const { data } = useQuery({
    queryKey: ["like-info", postId],
    queryFn: () =>
      kyInstance.get(`posts/${postId}/likes`).json<PostLikesInfo>(),
    placeholderData: initialState,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isLiked
        ? kyInstance.delete(`posts/${postId}/likes`)
        : kyInstance.post(`posts/${postId}/likes`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<PostLikesInfo>(queryKey);

      queryClient.setQueryData<PostLikesInfo>(queryKey, () => ({
        totalLikes:
          (previousState?.totalLikes || 0) + (previousState?.isLiked ? -1 : 1),
        isLiked: !previousState?.isLiked,
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
    <div className="flex w-fit flex-col items-center gap-1">
      <button onClick={() => mutate()}>
        <Heart
          className={cn(
            "size-5 text-blue-500",
            data?.isLiked && "fill-blue-600",
          )}
        />
      </button>
      <span className="text-sm tabular-nums text-gray-400">
        {data?.totalLikes}
      </span>
    </div>
  );
};

export default LikeButton;
