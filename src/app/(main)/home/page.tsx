import PostEditor from "@/components/post/editor/PostEditor";
import Feeds from "@/components/post/Feeds";
import React from "react";

export default function FeedsPage() {
  return (
    <div className="h-[180vh]">
      <PostEditor />
      <Feeds />
    </div>
  );
}
