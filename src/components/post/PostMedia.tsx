"use client";

import { PostData } from "@/lib/types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useMediaQuery } from "usehooks-ts";
import "swiper/css";
import "swiper/css/navigation";

const PostMedia = ({ post }: { post: PostData }) => {
  const largeScreen = useMediaQuery("(min-width: 1280px)");

  return (
    <Swiper
      navigation={largeScreen ? true : false}
      modules={largeScreen ? [Navigation] : []}
      className="mt-6"
      spaceBetween={8}
    >
      {post.attachments.map((a) => (
        <SwiperSlide key={a.id} className="relative aspect-square rounded-xl">
          <Image
            src={a.url}
            fill
            alt="post image"
            className="rounded-xl object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PostMedia;
