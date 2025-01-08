import { Images } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { PreviewFile } from "./PostInput";
import { validateFiles } from "@/lib/utils";

interface MediaInputProps {
  startUpload: (files: File[]) => void;
  setPreviewFiles: Dispatch<SetStateAction<PreviewFile[]>>;
}

const MediaInput = ({ startUpload, setPreviewFiles }: MediaInputProps) => {
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
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-full border border-muted-foreground bg-muted px-4 py-2 text-sm"
        onClick={onMediaClick}
      >
        <Images className="size-4 text-gray-400" />
        Upload Media
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
  );
};

export default MediaInput;
