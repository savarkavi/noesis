"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./style.css";

const PostCommentry = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write are your thoughts about this post",
      }),
    ],
  });

  return (
    <EditorContent
      editor={editor}
      className="border-b border-gray-600 pb-4 text-white"
    />
  );
};

export default PostCommentry;
