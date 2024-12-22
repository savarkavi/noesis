import { Loader2, PlusCircle } from "lucide-react";
import MediaInput from "./MediaInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import React, { useRef } from "react";
import { previewFile } from "./PostCommentry";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface PostEditorProps {
  isUploading: boolean;
  startUpload: (
    files: File[],
    input?: undefined,
  ) => Promise<
    | ClientUploadedFileData<{
        mediaId: string;
      }>[]
    | undefined
  >;
  setPreviewFiles: React.Dispatch<React.SetStateAction<previewFile[]>>;
  onSubmit: () => Promise<void>;
  input: string;
  value: string;
  isPending: boolean;
}

const PostEditorFooter = ({
  isUploading,
  startUpload,
  setPreviewFiles,
  onSubmit,
  input,
  value,
  isPending,
}: PostEditorProps) => {
  const loaderRef = useRef(null);

  useGSAP(
    () => {
      gsap
        .timeline({ repeat: -1 })
        .to("span", {
          y: -3,
          stagger: {
            each: 0.2,
            from: "start",
          },
          ease: "sine.inOut",
        })
        .to(
          "span",
          {
            y: 0,
            stagger: {
              each: 0.2,
              from: "start",
            },
            ease: "sine.inOut",
          },
          0.5,
        );
    },
    { dependencies: [isUploading], scope: loaderRef },
  );

  return (
    <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-400 pt-4">
      <div>
        {isUploading && (
          <div ref={loaderRef} className="upload-loader flex gap-2">
            <p className="text-sm">Uploading files</p>
            <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
            <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
            <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 self-end">
        <MediaInput
          startUpload={startUpload}
          setPreviewFiles={setPreviewFiles}
        />
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || isUploading || isPending}
          className={cn(
            "flex w-[100px] items-center justify-center rounded-xl border bg-blue-600 py-5 text-white",
            value
              ? "cursor-pointer opacity-100"
              : "cursor-default opacity-30 hover:bg-blue-600",
          )}
        >
          {isPending ? (
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

export default PostEditorFooter;
