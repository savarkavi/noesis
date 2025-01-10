"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Images } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { PreviewFile } from "./PostInput";
import { isValidUrl, validateFiles } from "@/lib/utils";

interface MediaInputProps {
  startUpload: (files: File[]) => void;
  previewFiles: PreviewFile[];
  setPreviewFiles: Dispatch<SetStateAction<PreviewFile[]>>;
  mediaCredit: string;
  onChangeMediaCredit: (src: string) => void;
}

const MediaInput = ({
  startUpload,
  setPreviewFiles,
  previewFiles,
  mediaCredit,
  onChangeMediaCredit,
}: MediaInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const onMediaClick = () => {
    inputRef.current?.click();
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      const validFiles = validateFiles(fileList);

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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="flex cursor-pointer items-center gap-2 rounded-full border border-muted-foreground bg-muted px-4 py-2 text-sm">
          <Images className="size-4 text-gray-400" />
          Upload Media
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Enter Media Information</DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex flex-col gap-3">
          <Label htmlFor="credits">Credits/Source</Label>
          <Input
            placeholder="link to the place where you found the media"
            id="credits"
            onChange={(e) => {
              const mediaSrc = e.target.value;
              setIsUrlValid(isValidUrl(mediaSrc));
              onChangeMediaCredit(e.target.value);
            }}
            value={mediaCredit}
            className={!isUrlValid ? "border-red-500" : ""}
          />
          {!isUrlValid && (
            <span className="text-sm text-red-500">
              Please enter a valid URL
            </span>
          )}
        </div>
        <div>
          <div
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full py-2 text-sm"
            onClick={onMediaClick}
          >
            <Images className="size-5 text-gray-400" />
            <span className="text-base">Upload Files</span>
            {previewFiles.length > 0 && (
              <p className="text-muted-foreground">{`(${previewFiles.length} ${previewFiles.length > 1 ? "files" : "file"} selected)`}</p>
            )}
          </div>
          <input
            ref={inputRef}
            onChange={(e) => onSelectFiles(e)}
            type="file"
            accept="image/*, video/*"
            multiple
            className="hidden"
          />
        </div>
        <Button
          className="self-end text-white"
          onClick={() => setIsOpen(false)}
          disabled={!isUrlValid}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MediaInput;
