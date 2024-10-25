"use client";

import { Button } from "@/components/ui/button";
import PostTypeDropdown from "./PostTypeDropdown";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PostCommentry from "./PostCommentry";

const PostEditor = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-12 border-b border-blue-400 p-6">
      <div className="flex items-center justify-between">
        <div className="h-14 w-14 rounded-full bg-blue-600"></div>
        <PostTypeDropdown value={value} setValue={setValue} />
      </div>
      {value === "commentry" && <PostCommentry />}
      <Button
        className={cn(
          "mx-auto flex w-full max-w-[300px] items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-white",
          value
            ? "cursor-pointer opacity-100"
            : "cursor-default opacity-30 hover:bg-blue-600",
        )}
      >
        <PlusCircle size={20} />
        <span className="text-lg">Post</span>
      </Button>
    </div>
  );
};

export default PostEditor;
