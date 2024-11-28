import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";

export interface Attachment {
  file: File;
  mediaId: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<
    ClientUploadedFileData<{
      mediaId: string;
    }>[]
  >([]);

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onClientUploadComplete(res) {
      setAttachments((prev) => [...prev, ...res.map((a) => a)]);
    },
  });

  return {
    attachments,
    startUpload,
    isUploading,
  };
}
