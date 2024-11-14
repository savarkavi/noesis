import PostEditor from "@/components/post/editor/PostEditor";
import Feed from "@/components/post/Feed";
import React from "react";

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      <PostEditor />
      <Feed />
    </div>
  );
}
