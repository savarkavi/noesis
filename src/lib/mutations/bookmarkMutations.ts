import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { kyInstance } from "../ky";
import { BookmarkFolderData } from "../types";

export function useUpdateBookmarkFolder(bookmarkId: string | undefined | null) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { folderName: string; isBookmarkSaved: boolean }) =>
      params.isBookmarkSaved
        ? kyInstance.delete(`bookmark-folders/${params.folderName}`, {
            json: { bookmarkId },
          })
        : kyInstance.post(`bookmark-folders/${params.folderName}`, {
            json: { bookmarkId },
          }),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["bookmark-folders"] });

      const previousData = queryClient.getQueryData<BookmarkFolderData[]>([
        "bookmark-folders",
      ]);

      queryClient.setQueryData<BookmarkFolderData[]>(
        ["bookmark-folders"],
        (old) => {
          if (!old) return old;
          return old.map((folder) => {
            if (folder.name === newData.folderName) {
              return {
                ...folder,
                bookmarks: newData.isBookmarkSaved
                  ? folder.bookmarks.filter((b) => b.bookmarkId !== bookmarkId)
                  : [...folder.bookmarks, { bookmarkId: bookmarkId! }],
              };
            }
            return folder;
          });
        },
      );

      toast.success(
        newData.isBookmarkSaved
          ? `Bookmark removed from ${newData.folderName}`
          : `Bookmark saved to ${newData.folderName}`,
      );
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark-folders"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong. Try again later.");
    },
  });

  return mutation;
}
