import BookmarkFolderMenu from "@/components/bookmark-feature/BookmarkFolderMenu";
import BookmarksFolderPosts from "@/components/post/BookmarksFolderPosts";
import { getCurrentSession } from "@/lib/session";
import React from "react";

const BookmarksFolderPage = async ({
  params,
}: {
  params: Promise<{ bookmarkFolder: string }>;
}) => {
  const { bookmarkFolder } = await params;

  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-lg text-blue-500">{bookmarkFolder}</p>
        <BookmarkFolderMenu folderName={bookmarkFolder} />
      </div>
      <BookmarksFolderPosts folderName={bookmarkFolder} userId={user?.id} />
    </div>
  );
};

export default BookmarksFolderPage;
