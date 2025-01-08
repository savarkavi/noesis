"use client";

import { useState } from "react";
import PostInput from "./PostInput";
import { PostType } from "@prisma/client";
import PostEditorHeader from "./PostEditorHeader";

const PostEditor = () => {
  const [value, setValue] = useState<PostType | null>(null);

  const handleValueChange = (type: PostType | null) => {
    setValue(type);
  };

  return (
    <div className="flex flex-col gap-12 p-6">
      <PostEditorHeader value={value} onValueChange={handleValueChange} />
      <PostInput value={value} />
    </div>
  );
};

export default PostEditor;
