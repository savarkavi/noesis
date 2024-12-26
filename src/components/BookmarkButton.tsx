"use client";

import { kyInstance } from "@/lib/ky";
import { PostBookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

const BookmarkButton = ({
  postId,
  initialState,
}: {
  postId: string;
  initialState: PostBookmarkInfo;
}) => {
  const { data } = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: () =>
      kyInstance.get(`posts/${postId}/bookmarks`).json<PostBookmarkInfo>(),
    placeholderData: initialState,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isBookmarked
        ? kyInstance.delete(`posts/${postId}/bookmarks`)
        : kyInstance.post(`posts/${postId}/bookmarks`),

    onMutate: async () => {
      toast.success(
        `Post ${data?.isBookmarked ? "removed from" : "saved to"} bookmarks`,
      );

      await queryClient.cancelQueries({ queryKey });
      const previousState =
        queryClient.getQueryData<PostBookmarkInfo>(queryKey);

      queryClient.setQueryData<PostBookmarkInfo>(queryKey, () => ({
        isBookmarked: !previousState?.isBookmarked,
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
    <button onClick={() => mutate()}>
      <Bookmark
        className={cn(
          "size-6 text-blue-500",
          data?.isBookmarked && "fill-blue-600",
        )}
      />
    </button>
  );
};

export default BookmarkButton;
