"use client";

import PostTypeDropdown from "./PostTypeDropdown";
import { useState } from "react";
import PostCommentry from "./PostCommentry";

const PostEditor = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-12 border-b border-blue-400 p-6">
      <div className="flex items-center justify-between">
        <div className="h-14 w-14 rounded-full bg-blue-600"></div>
        <PostTypeDropdown value={value} setValue={setValue} />
      </div>
      <PostCommentry value={value} />
    </div>
  );
};

export default PostEditor;
