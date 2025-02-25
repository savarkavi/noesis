import BookmarksPosts from "@/components/post/BookmarksPosts";
import { getCurrentSession } from "@/lib/session";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookmarksFolders from "@/components/bookmarks-page/BookmarksFolders";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default async function BookmarksPage() {
  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div className="min-h-screen">
      <Tabs defaultValue="all-bookmarks">
        <TabsList className="h-fit w-full rounded-none">
          <TabsTrigger value="all-bookmarks" className="w-1/2 p-3">
            All Bookmarks
          </TabsTrigger>
          <TabsTrigger value="folders" className="w-1/2 p-3">
            Folders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-bookmarks">
          <BookmarksPosts userId={user.id} />
        </TabsContent>
        <TabsContent value="folders">
          <BookmarksFolders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
