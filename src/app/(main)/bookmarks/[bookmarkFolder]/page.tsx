import BookmarksFolderPosts from "@/components/post/BookmarksFolderPosts";
import { getCurrentSession } from "@/lib/session";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
      <div className="flex items-center justify-between p-4">
        <p>{bookmarkFolder}</p>
        <DotsHorizontalIcon className="size-6" />
      </div>
      <BookmarksFolderPosts folderName={bookmarkFolder} userId={user?.id} />
    </div>
  );
};

export default BookmarksFolderPage;
