import { PostData } from "@/lib/types";
import { Play } from "lucide-react";
import Image from "next/image";
import React from "react";

const YoutubeVideoPreview = ({ post }: { post: PostData }) => {
  console.log(post.youtubeVideoThumbnail);

  return (
    <div className="flex h-full w-full flex-col text-white">
      <div className="rouned-lg relative h-[300px] w-full">
        <Image
          src={post.youtubeVideoThumbnail || ""}
          alt="youtube video thumbnail"
          fill
          className="rounded-lg object-cover brightness-75"
        />
        <Play className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 fill-blue-500" />
      </div>
      <div className="flex flex-col gap-2 py-4 text-base">
        <p className="font-serif text-xl font-bold">{post.youtubeVideoTitle}</p>
        <p className="line-clamp-3 font-serif font-bold text-muted-foreground">
          {post.youtubeVideoDescription}
        </p>
        <p className="text-muted-foreground">www.youtube.com</p>
      </div>
    </div>
  );
};

export default YoutubeVideoPreview;
