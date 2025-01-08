import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PreviewFile } from "./PostInput";
import { CircleX } from "lucide-react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "./player.css";
import type { VideoMimeType } from "@vidstack/react";

interface PreviewFilesProp {
  previewFiles: PreviewFile[];
  removeAttachment: (fileName: string) => void;
  setPreviewFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
  isUploading: boolean;
}

const PreviewFiles = ({
  previewFiles,
  setPreviewFiles,
  removeAttachment,
  isUploading,
}: PreviewFilesProp) => {
  const onRemoveClick = (name: string) => {
    setPreviewFiles((prev) => prev.filter((f) => f.name !== name));
    removeAttachment(name);
  };

  return (
    <Swiper navigation={true} modules={[Navigation]} className="my-8">
      {previewFiles.map((file) => {
        return (
          <SwiperSlide key={file.url}>
            <div className="relative flex w-full items-center justify-center">
              {file.type.startsWith("image") ? (
                <div className="relative h-[400px] w-full">
                  <Image
                    src={file.url}
                    alt="image preview"
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full">
                  <MediaPlayer
                    src={{ src: file.url, type: file.type as VideoMimeType }}
                    viewType="video"
                    playsInline
                    crossOrigin
                  >
                    <MediaProvider />
                    <DefaultAudioLayout icons={defaultLayoutIcons} />
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
                </div>
              )}
              {!isUploading && (
                <CircleX
                  className="absolute right-2 top-2 cursor-pointer rounded-full bg-black"
                  onClick={() => onRemoveClick(file.name)}
                />
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default PreviewFiles;
