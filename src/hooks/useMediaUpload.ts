import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";

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

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((f) => f.name !== fileName));
  }

  return {
    attachments,
    setAttachments,
    startUpload,
    isUploading,
    removeAttachment,
  };
}
