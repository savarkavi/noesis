import PostEditor from "@/components/post/editor/PostEditor";
import Feed from "@/components/post/Feed";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingPosts from "@/components/post/FollowingPosts";
import { getCurrentSession } from "@/lib/session";

export default async function FeedPage() {
  const { user } = await getCurrentSession();

  if (!user) return;

  return (
    <div className="min-h-screen">
      <PostEditor />
      <Tabs defaultValue="feed" className="mt-6">
        <TabsList className="h-fit w-full rounded-none">
          <TabsTrigger value="feed" className="w-1/2 p-3">
            Feed
          </TabsTrigger>
          <TabsTrigger value="following" className="w-1/2 p-3">
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <Feed userId={user.id} />
        </TabsContent>
        <TabsContent value="following">
          <FollowingPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
