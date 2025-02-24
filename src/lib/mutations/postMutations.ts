import { createPost, deletePost } from "@/app/(main)/actions/postActions";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "@/contexts/SessionProvider";
import { PostPage } from "../types";

export function useCreatePostMutation() {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post"],
        predicate(query) {
          return (
            query.queryKey.includes("feed") ||
            (query.queryKey.includes("user-post") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        {
          queryKey: ["post"],
          predicate(query) {
            return (
              query.queryKey.includes("feed") ||
              (query.queryKey.includes("user-post") &&
                query.queryKey.includes(user.id))
            );
          },
        },
        (data) => {
          const firstPage = data?.pages[0];

          if (firstPage) {
            return {
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
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
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to create the post. Try again later.");
    },
  });

  return mutation;
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter = { queryKey: ["post"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (data) => {
          if (!data) return;

          return {
            pages: data.pages.map((page) => ({
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
              nextCursor: page.nextCursor,
            })),
            pageParams: data.pageParams,
          };
        },
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete the post. Try again later.");
    },
  });

  return mutation;
}
