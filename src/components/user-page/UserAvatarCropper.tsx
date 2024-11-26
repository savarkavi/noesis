import Cropper, { ReactCropperElement } from "react-cropper";
import { useRef } from "react";
import "cropperjs/dist/cropper.css";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface UserAvatarCropperProps {
  src: string;
  onClose: () => void;
  onImageCropped: (blob: Blob | null) => void;
}

const UserAvatarCropper = ({
  src,
  onClose,
  onImageCropped,
}: UserAvatarCropperProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) return;
    cropper
      .getCroppedCanvas()
      .toBlob((blob) => onImageCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Crop the image you&apos;ve selected</DialogTitle>
        <Cropper src={src} ref={cropperRef} />
        <DialogFooter>
          <Button
            type="button"
            className="mt-2 w-24 text-white"
            onClick={onCrop}
          >
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAvatarCropper;
