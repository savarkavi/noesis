import { Images } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { previewFile } from "./PostCommentry";
import { validateFiles } from "@/lib/utils";

interface MediaInputProps {
  startUpload: (files: File[]) => void;
  setPreviewFiles: Dispatch<SetStateAction<previewFile[]>>;
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
      <Images
        className="size-6 cursor-pointer text-gray-400"
        onClick={onMediaClick}
      />
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
