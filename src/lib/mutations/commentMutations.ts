import {
  createComment,
  deleteComment,
} from "@/app/(main)/actions/commentActions";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CommentPage } from "../types";
import { toast } from "sonner";

export function useCreateCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (data) => {
          const firstPage = data?.pages[0];

          if (firstPage) {
            return {
              pages: [
                {
                  comments: [newComment, ...firstPage.comments],
                  nextCursor: firstPage.nextCursor,
                },
                ...data.pages.slice(1),
              ],
              pageParams: data.pageParams,
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
        predicate(query) {
          return !query.state.data;
        },
      });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to submit comment. Try again later.");
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (data) => {
          if (!data) return;

          return {
            pages: data.pages.map((page) => ({
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id,
              ),
              nextCursor: page.nextCursor,
            })),
            pageParams: data.pageParams,
          };
        },
      );
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete the comment. Try again later.");
    },
  });

  return mutation;
}
