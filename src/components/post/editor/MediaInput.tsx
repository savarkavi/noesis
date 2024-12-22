import { Images } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { previewFile } from "./PostCommentry";
import { toast } from "sonner";

interface MediaInputProps {
  startUpload: (files: File[]) => void;
  setPreviewFiles: Dispatch<SetStateAction<previewFile[]>>;
}

const MediaInput = ({ startUpload, setPreviewFiles }: MediaInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onMediaClick = () => {
    inputRef.current?.click();
  };

  const validateFiles = (files: File[]) => {
    const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 64 * 1024 * 1024;

    const validFiles = files.filter((f) => {
      if (f.type.startsWith("image/")) {
        if (f.size > MAX_IMAGE_SIZE) {
          toast.error(`Image ${f.name} exceeds 4mb limit`);
          return false;
        }
      } else if (f.type.startsWith("video/")) {
        if (f.size > MAX_VIDEO_SIZE) {
          toast.error(`Video ${f.name} exceeds 64mb limit`);
          return false;
        }
      }

      return true;
    });

    return validFiles.map((f) => {
      const extension = f.name.split(".").pop();
      const newName = `attachment_${crypto.randomUUID()}.${extension}`;
      return new File([f], newName, {
        type: f.type,
      });
    });
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      const files = Array.from(fileList);
      const validFiles = validateFiles(files);

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
