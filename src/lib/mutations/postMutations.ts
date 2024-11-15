import { createPost } from "@/app/(main)/actions/postActions";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { PostPage } from "../types";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilter = { queryKey: ["post", "feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
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
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create the post. Try again later.");
    },
  });

  return mutation;
}
