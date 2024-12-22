"use client";

import { PostData } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useMediaQuery } from "usehooks-ts";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "swiper/css";
import "swiper/css/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import PostImageDialog from "./PostImageDialog";

const PostMedia = ({ post }: { post: PostData }) => {
  const largeScreen = useMediaQuery("(min-width: 1280px)");

  return (
    <Swiper
      navigation={largeScreen ? true : false}
      modules={largeScreen ? [Navigation] : []}
      className="mt-6"
      spaceBetween={8}
    >
      {post.attachments.map((a) => {
        return (
          <SwiperSlide key={a.id} className="relative rounded-xl">
            <div className="relative flex w-full items-center justify-center">
              {a.type.startsWith("IMAGE") ? (
                <PostImageDialog src={a.url} />
              ) : (
                <div className="relative w-full">
                  <MediaPlayer
                    src={a.url}
                    viewType="video"
                    playsInline
                    crossOrigin
                  >
                    <MediaProvider />
                    <DefaultVideoLayout
                      smallLayoutWhen={false}
                      icons={defaultLayoutIcons}
                    />
                  </MediaPlayer>
                </div>
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default PostMedia;
