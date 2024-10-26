"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./style.css";
import { createPost } from "@/app/(main)/actions/postActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

const PostCommentry = ({ value }: { value: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write your thoughts about this post",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    await createPost(input);
    editor?.commands.clearContent();
  };

  return (
    <div>
      <EditorContent
        editor={editor}
        className="border-b border-gray-600 pb-4 text-white"
      />
      <Button
        onClick={onSubmit}
        disabled={!input.trim()}
        className={cn(
          "mx-auto mt-12 flex w-full max-w-[300px] items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-white",
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

export default PostCommentry;
