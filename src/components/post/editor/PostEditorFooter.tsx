import { Loader2, PlusCircle } from "lucide-react";
import MediaInput from "./MediaInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import React, { useRef } from "react";
import { LinkInfo, PreviewFile } from "./PostInput";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PostType } from "@prisma/client";
import LinkDialog from "./LinkDialog";
import { Input } from "@/components/ui/input";

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
  previewFiles: PreviewFile[];
  setPreviewFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
  onSubmit: () => Promise<void>;
  value: PostType | null;
  isPending: boolean;
  linkInfo: LinkInfo;
  onChangeLinkInfo: (title: string, url: string) => void;
  mediaCredit: string;
  onChangeMediaCredit: (src: string) => void;
  youtubeUrl: string;
  onChangeYoutubeUrl: (url: string) => void;
}

const PostEditorFooter = ({
  isUploading,
  startUpload,
  previewFiles,
  setPreviewFiles,
  onSubmit,
  value,
  isPending,
  linkInfo,
  onChangeLinkInfo,
  mediaCredit,
  onChangeMediaCredit,
  youtubeUrl,
  onChangeYoutubeUrl,
}: PostEditorProps) => {
  const loaderRef = useRef(null);

  const handleButtonDisabled = () => {
    if (value === "ARTICLE" || value === "EXTERNAL_LINK") {
      return (
        isUploading ||
        isPending ||
        !value ||
        !linkInfo.title.trim() ||
        !linkInfo.url.trim()
      );
    }
    if (value === "MEDIA") {
      return (
        isUploading ||
        isPending ||
        !value ||
        !mediaCredit.trim() ||
        !previewFiles.length
      );
    }
    if (value === "YOUTUBE_VIDEO") {
      return isUploading || isPending || !value || !youtubeUrl.trim();
    }
  };

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
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {value !== null &&
            (value !== "MEDIA" ? (
              value === "YOUTUBE_VIDEO" ? (
                <Input
                  placeholder="paste youtube video url"
                  onChange={(e) => onChangeYoutubeUrl(e.target.value)}
                  value={youtubeUrl}
                  className="border-muted-foreground bg-muted focus-visible:ring-0"
                />
              ) : (
                <LinkDialog
                  linkInfo={linkInfo}
                  onChangeLinkInfo={onChangeLinkInfo}
                />
              )
            ) : (
              <MediaInput
                startUpload={startUpload}
                previewFiles={previewFiles}
                setPreviewFiles={setPreviewFiles}
                mediaCredit={mediaCredit}
                onChangeMediaCredit={onChangeMediaCredit}
              />
            ))}
          <div>
            {isUploading && (
              <div ref={loaderRef} className="upload-loader flex w-fit gap-2">
                <p className="text-sm">Uploading files</p>
                <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
                <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
                <span className="mb-1 h-1 w-1 self-end rounded-full bg-blue-500"></span>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={onSubmit}
          disabled={handleButtonDisabled()}
          className={cn(
            "flex w-[100px] items-center justify-center rounded-xl border bg-blue-600 py-5 text-white",
            value ? "cursor-pointer opacity-100" : "cursor-not-allowed",
          )}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <PlusCircle className="size-12 shrink-0" />
              <span className="text-lg">Post</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostEditorFooter;
