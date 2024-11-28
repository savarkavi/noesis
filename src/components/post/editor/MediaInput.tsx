import { Images } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { previewFile } from "./PostCommentry";

interface MediaInputProps {
  startUpload: (files: File[]) => void;
  setPreviewFiles: Dispatch<SetStateAction<previewFile[]>>;
}

const MediaInput = ({ startUpload, setPreviewFiles }: MediaInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onMediaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <Images
        className="size-6 cursor-pointer text-gray-400"
        onClick={onMediaClick}
      />
      <input
        ref={inputRef}
        onChange={(e) => {
          const fileList = e.target.files;
          if (fileList) {
            const files = Array.from(fileList);
            setPreviewFiles((prev) => [
              ...prev,
              ...files.map((f) => ({
                type: f.type,
                url: URL.createObjectURL(f),
              })),
            ]);
            startUpload(files);
          }
        }}
        type="file"
        accept="image/*, video/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default MediaInput;
