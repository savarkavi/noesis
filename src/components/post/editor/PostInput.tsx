"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn, isValidUrl, validateFiles } from "@/lib/utils";
import { useCreatePostMutation } from "@/lib/mutations/postMutations";
import { toast } from "sonner";
import useMediaUpload from "@/hooks/useMediaUpload";
import "./style.css";
import { useEffect, useState } from "react";
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
  const [mediaCredit, setMediaCredit] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleChangeLinkInfo = (title: string, url: string) => {
    setLinkInfo({ title, url });
  };

  const handleChangeMediaCredit = (src: string) => {
    setMediaCredit(src);
  };

  const handleChangeYoutubeUrl = (url: string) => {
    setYoutubeUrl(url);
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

  useEffect(() => {
    if (editor) {
      const placeholderExtension = editor.extensionManager.extensions.find(
        (extension) => extension.name === "placeholder",
      );
      if (placeholderExtension) {
        placeholderExtension.options["placeholder"] = !value
          ? "Found something on the internet? Share it with the World!"
          : "Write a caption about the post...";
        editor.view.updateState(editor.view.state);
      }
    }
  }, [value, editor]);

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = async () => {
    if (value)
      toast.promise(
        mutation.mutateAsync({
          caption: input || null,
          attachments: attachments.map((a) => a.serverData.mediaId),
          type: value,
          sourceTitle:
            value === "ARTICLE" || value === "EXTERNAL_LINK"
              ? linkInfo.title
              : null,
          source:
            value !== "MEDIA"
              ? value === "YOUTUBE_VIDEO"
                ? youtubeUrl
                : linkInfo.url
              : mediaCredit,
        }),
        {
          loading: "Creating post...",
          success: () => {
            editor?.commands.clearContent();
            setPreviewFiles([]);
            setAttachments([]);
            setLinkInfo({ title: "", url: "" });
            setMediaCredit("");
            setYoutubeUrl("");
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
      {value !== "MEDIA" &&
        linkInfo.url.trim() !== "" &&
        isValidUrl(linkInfo.url) && (
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
        previewFiles={previewFiles}
        setPreviewFiles={setPreviewFiles}
        onSubmit={onSubmit}
        value={value}
        isPending={mutation.isPending}
        linkInfo={linkInfo}
        onChangeLinkInfo={handleChangeLinkInfo}
        mediaCredit={mediaCredit}
        onChangeMediaCredit={handleChangeMediaCredit}
        youtubeUrl={youtubeUrl}
        onChangeYoutubeUrl={handleChangeYoutubeUrl}
      />
    </div>
  );
};

export default PostInput;
