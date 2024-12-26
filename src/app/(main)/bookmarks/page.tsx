import BookmarksPosts from "@/components/post/BookmarksPosts";
import { getCurrentSession } from "@/lib/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default async function BookmarksPage() {
  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div className="min-h-screen">
      <BookmarksPosts userId={user.id} />
    </div>
  );
}
