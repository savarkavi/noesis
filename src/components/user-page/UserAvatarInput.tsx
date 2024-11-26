"use client";

import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import UserAvatarCropper from "./UserAvatarCropper";
import Resizer from "react-image-file-resizer";

interface UserAvatarInputProps {
  src: string | null;
  onImageCropped: (blob: Blob | null) => void;
}

const UserAvatarInput = ({ src, onImageCropped }: UserAvatarInputProps) => {
  const [selectedImage, setSelectedImage] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setSelectedImage(uri as File),
      "file",
    );
  };

  return (
    <div className="-ml-3 mb-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
      />
      <button onClick={() => inputRef.current?.click()}>
        <div className="relative h-32 w-32 rounded-full">
          <Image
            src={src || profilePlaceholder}
            alt="profile image preview"
            fill
            className="rounded-full object-cover opacity-45"
          />
          <Camera className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </button>
      {selectedImage && (
        <UserAvatarCropper
          src={URL.createObjectURL(selectedImage)}
          onImageCropped={onImageCropped}
          onClose={() => {
            setSelectedImage(undefined);
            if (inputRef.current?.value) {
              inputRef.current.value = "";
            }
          }}
        />
      )}
    </div>
  );
};

export default UserAvatarInput;
