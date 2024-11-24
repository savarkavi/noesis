import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UserProfileValues } from "../validation";
import { updateUserProfile } from "@/app/(main)/actions/userActions";
import { useUploadThing } from "../uploadthing";
import { PostPage } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { startUpload } = useUploadThing("userAvatar");

  const mutation = useMutation({
    mutationFn: async ({
      data,
      avatar,
    }: {
      data: UserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(data),
        avatar && startUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const queryFilter = { queryKey: ["post"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (data) => {
          if (!data) return;

          return {
            pageParams: data.pageParams,
            pages: data.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.userId === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      fullname: updatedUser.fullname,
                      username: updatedUser.username,
                      avatarUrl:
                        uploadResult?.[0].serverData.avatarUrl ||
                        updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast.success("User profile updated");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update the profile");
    },
  });

  return mutation;
}
