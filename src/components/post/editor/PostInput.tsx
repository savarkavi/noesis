"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn, validateFiles } from "@/lib/utils";
import { useCreatePostMutation } from "@/lib/mutations/postMutations";
import { toast } from "sonner";
import useMediaUpload from "@/hooks/useMediaUpload";
import "./style.css";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import PreviewFiles from "./PreviewFiles";
import PostEditorFooter from "./PostEditorFooter";
import { useDropzone } from "@uploadthing/react";
import { PostType } from "@prisma/client";
import Link from "@tiptap/extension-link";

export interface PreviewFile {
  type: string;
  url: string;
  name: string;
}

export interface LinkInfo {
  title: string;
  url: string;
}

const PostInput = ({ value }: { value: PostType | null }) => {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [linkInfo, setLinkInfo] = useState<LinkInfo>({
    title: "",
    url: "",
  });

  const handleChangeLinkInfo = (title: string, url: string) => {
    setLinkInfo({ title, url });
  };

  const mutation = useCreatePostMutation();

  const {
    attachments,
    setAttachments,
    startUpload,
    isUploading,
    removeAttachment,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const fileList = new DataTransfer();
      files.forEach((file) => fileList.items.add(file));
      const validFiles = validateFiles(fileList.files);

      if (validFiles.length > 0) {
        setPreviewFiles((prev) => [
          ...prev,
          ...validFiles.map((f) => {
            return {
              type: f.type,
              url: URL.createObjectURL(f),
              name: f.name,
            };
          }),
        ]);
        startUpload(validFiles);
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write a caption about the post...",
      }),
      Link.configure({
        autolink: true,
        isAllowedUri: (url, ctx) =>
          ctx.defaultValidate(url) &&
          !url.startsWith("./") &&
          !url.includes(" "),
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    if (value)
      toast.promise(
        mutation.mutateAsync({
          caption: input,
          attachments: attachments.map((a) => a.serverData.mediaId),
          type: value,
          linkTitle: linkInfo.title,
          linkUrl: linkInfo.url,
        }),
        {
          loading: "Creating post...",
          success: () => {
            editor?.commands.clearContent();
            setPreviewFiles([]);
            setAttachments([]);
            setLinkInfo({ title: "", url: "" });
            return "Post created";
          },
          error: "Failed to create the post. Try again later.",
        },
      );
  };

  return (
    <div>
      <div {...rootProps} className="w-full">
        <EditorContent
          editor={editor}
          className={cn(
            "text-white",
            isDragActive && "rounded-xl px-2 outline-dashed outline-[0.5px]",
          )}
        />
        <input {...getInputProps()} />
      </div>
      {value !== "MEDIA" && linkInfo.url.trim() !== "" && (
        <div className="mt-4 w-fit cursor-pointer">
          <a
            target="_blank"
            href={linkInfo.url}
            className="text-xl text-blue-600"
          >
            {linkInfo.title}
          </a>
        </div>
      )}
      {previewFiles.length > 0 && value === "MEDIA" && (
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
        linkInfo={linkInfo}
        onChangeLinkInfo={handleChangeLinkInfo}
      />
    </div>
  );
};

export default PostInput;
