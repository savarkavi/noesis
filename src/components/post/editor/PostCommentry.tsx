"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useCreatePostMutation } from "@/lib/mutations/postMutations";
import "./style.css";
import { toast } from "sonner";

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
    immediatelyRender: false,
  });

  const mutation = useCreatePostMutation();
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    toast.promise(mutation.mutateAsync(input), {
      loading: "Creating post...",
      success: () => {
        editor?.commands.clearContent();
        return "Post created";
      },
      error: "Failed to create the post. Try again later.",
    });
  };

  return (
    <div>
      <EditorContent
        editor={editor}
        className="border-b border-gray-400 pb-4 text-white"
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
