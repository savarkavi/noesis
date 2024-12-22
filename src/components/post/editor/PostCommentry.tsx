"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useCreatePostMutation } from "@/lib/mutations/postMutations";
import { toast } from "sonner";
import useMediaUpload from "@/hooks/useMediaUpload";
import "./style.css";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import PreviewFiles from "./PreviewFiles";
import PostEditorFooter from "./PostEditorFooter";

export interface previewFile {
  type: string;
  url: string;
  name: string;
}

const PostCommentry = ({ value }: { value: string }) => {
  const [previewFiles, setPreviewFiles] = useState<previewFile[]>([]);

  const mutation = useCreatePostMutation();

  const {
    attachments,
    setAttachments,
    startUpload,
    isUploading,
    removeAttachment,
  } = useMediaUpload();

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

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    toast.promise(
      mutation.mutateAsync({
        caption: input,
        attachments: attachments.map((a) => a.serverData.mediaId),
      }),
      {
        loading: "Creating post...",
        success: () => {
          editor?.commands.clearContent();
          setPreviewFiles([]);
          setAttachments([]);
          return "Post created";
        },
        error: "Failed to create the post. Try again later.",
      },
    );
  };

  return (
    <div>
      <EditorContent
        editor={editor}
        className={cn(
          "text-white",
          previewFiles.length > 0 && "border-b border-gray-400 pb-4",
        )}
      />
      {previewFiles.length > 0 && (
        <PreviewFiles
          previewFiles={previewFiles}
          setPreviewFiles={setPreviewFiles}
          removeAttachment={removeAttachment}
          isUploading={isUploading}
        />
      )}
      <PostEditorFooter
        isUploading={isUploading}
        startUpload={startUpload}
        setPreviewFiles={setPreviewFiles}
        onSubmit={onSubmit}
        input={input}
        value={value}
        isPending={mutation.isPending}
      />
    </div>
  );
};

export default PostCommentry;
