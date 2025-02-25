"use client";

import { kyInstance } from "@/lib/ky";
import { BookmarkFolder, PostBookmarkInfo } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark, CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CreateBookmarkFolderButton from "./CreateBookmarkFolderButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BookmarkFolders from "./BookmarkFolders";
import { Separator } from "../ui/separator";

const BookmarkButton = ({
  postId,
  initialState,
}: {
  postId: string;
  initialState: PostBookmarkInfo;
}) => {
  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: () =>
      kyInstance.get(`posts/${postId}/bookmarks`).json<PostBookmarkInfo>(),
    placeholderData: initialState,
    staleTime: Infinity,
  });

  const { data: bookmarkFolderData } = useQuery({
    queryKey: ["bookmark-folders"],
    queryFn: () => kyInstance.get("bookmark-folders").json<BookmarkFolder[]>(),
  });

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { mutate } = useMutation({
    mutationFn: () =>
      bookmarkData?.isBookmarked
        ? kyInstance.delete(`posts/${postId}/bookmarks`)
        : kyInstance.post(`posts/${postId}/bookmarks`),

    onMutate: async () => {
      toast.success(
        `Post ${bookmarkData?.isBookmarked ? "removed from" : "saved to"} bookmarks`,
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
      toast.error("Failed to bookmark the post.");
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={() => {
            if (!bookmarkData?.isBookmarked) {
              mutate();
            }
          }}
        >
          <Bookmark
            className={cn(
              "size-6 text-blue-500",
              bookmarkData?.isBookmarked && "fill-blue-500",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit flex-col p-0 text-sm">
        <div className="flex items-center justify-between gap-6 px-4 py-2">
          <span>
            {bookmarkData?.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          </span>
          <Bookmark
            className={cn(
              "cursor-pointer",
              bookmarkData?.isBookmarked && "fill-blue-600",
            )}
            onClick={() => mutate()}
          />
        </div>
        {bookmarkFolderData && bookmarkFolderData.length > 0 && (
          <div>
            <Separator />
            <div className="px-4 py-2">
              <p className="text-sm text-muted-foreground">
                Add post to a folder
              </p>
            </div>
            <BookmarkFolders data={bookmarkFolderData} />
            <Separator />
          </div>
        )}
        <CreateBookmarkFolderButton>
          <div className="flex items-center gap-2 px-4 py-2 hover:bg-muted">
            <CirclePlus className="size-4" />
            <span>Create folder</span>
          </div>
        </CreateBookmarkFolderButton>
      </PopoverContent>
    </Popover>
  );
};

export default BookmarkButton;
