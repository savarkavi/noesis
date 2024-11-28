"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useCreatePostMutation } from "@/lib/mutations/postMutations";
import { toast } from "sonner";
import useMediaUpload from "@/hooks/useMediaUpload";
import "./style.css";
import MediaInput from "./MediaInput";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export interface previewFile {
  type: string;
  url: string;
}

const PostCommentry = ({ value }: { value: string }) => {
  const [previewFiles, setPreviewFiles] = useState<previewFile[]>([]);

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

  const { attachments, startUpload, isUploading } = useMediaUpload();

  const mutation = useCreatePostMutation();
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
        <Swiper navigation={true} modules={[Navigation]} className="my-8">
          {previewFiles.map((file) => (
            <SwiperSlide key={file.url}>
              {file.type.startsWith("image") ? (
                <div className="relative flex h-[300px] w-full items-center justify-center">
                  <Image
                    src={file.url}
                    alt="image preview"
                    fill
                    className={cn(
                      "rounded-xl object-contain",
                      isUploading && "opacity-50",
                    )}
                  />
                  {isUploading && (
                    <Loader2 className="size-6 animate-spin text-blue-500" />
                  )}
                </div>
              ) : (
                <video controls>
                  <source src={file.url} type={file.type} />
                </video>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="mt-4 flex items-center justify-end gap-4 border-t border-gray-400 pt-4">
        <MediaInput
          startUpload={startUpload}
          setPreviewFiles={setPreviewFiles}
        />
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className={cn(
            "flex w-[100px] items-center justify-center rounded-xl border bg-blue-600 py-5 text-white",
            value
              ? "cursor-pointer opacity-100"
              : "cursor-default opacity-30 hover:bg-blue-600",
          )}
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-3">
              <PlusCircle size={20} />
              <span className="text-lg">Post</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostCommentry;
