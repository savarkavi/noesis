"use client";

import { useCreateCommentMutation } from "@/lib/mutations/commentMutations";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Send } from "lucide-react";
import { toast } from "sonner";

const CommentInput = ({ postId }: { postId: string }) => {
  const mutation = useCreateCommentMutation(postId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "write a comment...",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    toast.promise(
      mutation.mutateAsync({
        content: input,
        postId,
      }),
      {
        loading: "submitting comment...",
        success: () => {
          editor?.commands.clearContent();
          return "Comment submitted";
        },
        error: "Failed to submit the comment. Try again later.",
      },
    );
  };

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <EditorContent
        editor={editor}
        className="w-full rounded-full border border-gray-500 px-4 py-2 text-white"
      />
      <button onClick={onSubmit} disabled={!input.trim() || mutation.isPending}>
        <Send className="size-7 text-gray-500" />
      </button>
    </div>
  );
};

export default CommentInput;
