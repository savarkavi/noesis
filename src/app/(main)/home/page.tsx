import PostEditor from "@/components/post/editor/PostEditor";
import Feed from "@/components/post/Feed";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingPosts from "@/components/post/FollowingPosts";

export default function FeedPage() {
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
          <Feed />
        </TabsContent>
        <TabsContent value="following">
          <FollowingPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
