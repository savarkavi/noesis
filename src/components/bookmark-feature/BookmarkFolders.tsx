"use client";

import { BookmarkFolderData } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useUpdateBookmarkFolder } from "@/lib/mutations/bookmarkMutations";

interface BookmarkFoldersProps {
  data: BookmarkFolderData[];
  bookmarkId: string | null | undefined;
}

const BookmarkFolders = ({ data, bookmarkId }: BookmarkFoldersProps) => {
  const { mutate } = useUpdateBookmarkFolder(bookmarkId);

  return (
    <div className="change-scrollbar mb-2 flex max-h-[150px] flex-col overflow-y-scroll">
      {data?.map((folder) => {
        const isBookmarkSaved = folder.bookmarks.find(
          (bookmark) => bookmark.bookmarkId === bookmarkId,
        );

        return (
          <div
            key={folder.id}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              mutate({
                folderName: folder.name,
                isBookmarkSaved: !!isBookmarkSaved,
              });
            }}
          >
            <Checkbox id={folder.name} checked={!!isBookmarkSaved} />
            <Label
              htmlFor={folder.name}
              className="w-full cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {folder.name}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

export default BookmarkFolders;
