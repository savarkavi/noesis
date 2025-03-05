"use client";

import { kyInstance } from "@/lib/ky";
import { BookmarkFolderData, PostBookmarkInfo } from "@/lib/types";
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

  const { data: bookmarkFolders } = useQuery({
    queryKey: ["bookmark-folders"],
    queryFn: () =>
      kyInstance.get("bookmark-folders").json<BookmarkFolderData[]>(),
  });

  const queryClient = useQueryClient();
  const bookmarkQueryKey: QueryKey = ["bookmark-info", postId];
  const foldersQueryKey: QueryKey = ["bookmark-folders"];

  const { mutateAsync } = useMutation({
    mutationFn: () =>
      bookmarkData?.isBookmarked
        ? kyInstance.delete(`posts/${postId}/bookmarks`)
        : kyInstance.post(`posts/${postId}/bookmarks`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: bookmarkQueryKey });
      await queryClient.cancelQueries({ queryKey: foldersQueryKey });

      const previousBookmarkState =
        queryClient.getQueryData<PostBookmarkInfo>(bookmarkQueryKey);
      const previousFoldersState =
        queryClient.getQueryData<BookmarkFolderData[]>(foldersQueryKey);

      queryClient.setQueryData<PostBookmarkInfo>(bookmarkQueryKey, () => ({
        id: previousBookmarkState ? previousBookmarkState.id : null,
        isBookmarked: !previousBookmarkState?.isBookmarked,
      }));

      if (bookmarkData?.isBookmarked && bookmarkData.id) {
        queryClient.setQueryData<BookmarkFolderData[]>(
          foldersQueryKey,
          (oldData) => {
            if (!oldData) return oldData;

            return oldData.map((folder) => ({
              ...folder,
              bookmarks: folder.bookmarks.filter(
                (bookmark) => bookmark.bookmarkId !== bookmarkData.id,
              ),
            }));
          },
        );
      }

      return { previousBookmarkState, previousFoldersState };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(
        bookmarkQueryKey,
        context?.previousBookmarkState,
      );
      queryClient.setQueryData(foldersQueryKey, context?.previousFoldersState);
      console.log(error);
    },
  });

  const handleBookmarkClick = () => {
    toast.promise(mutateAsync(), {
      loading: ` ${bookmarkData?.isBookmarked ? "Removing" : "Saving"} bookmark`,
      success: () =>
        `Post ${bookmarkData?.isBookmarked ? "removed from" : "saved to"} bookmarks`,
      error: "Something went wrong. Try again later.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={() => {
            if (!bookmarkData?.isBookmarked) {
              handleBookmarkClick();
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
            onClick={handleBookmarkClick}
          />
        </div>
        {bookmarkFolders && bookmarkFolders.length > 0 && (
          <div>
            <Separator />
            <div className="px-4 py-2">
              <p className="text-sm text-muted-foreground">
                Add post to a folder
              </p>
            </div>
            <BookmarkFolders
              data={bookmarkFolders}
              bookmarkId={bookmarkData?.id}
            />
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
