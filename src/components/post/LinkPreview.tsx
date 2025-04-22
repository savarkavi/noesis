"use client";

import { LinkMetadata } from "@prisma/client";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LinkPreview = ({ metadata }: { metadata: LinkMetadata }) => {
  const [isLoading, setIsLoading] = useState(true);

  const proxyImageUrl = `/api/link-image-proxy?url=${encodeURIComponent(metadata.image)}`;
  const urlWithoutProtocol = new URL(metadata.url).hostname;

  return (
    <div className="flex h-full w-full flex-col text-white">
      {metadata.image && (
        <div className="relative h-[300px] w-full rounded-lg">
          {isLoading && <Skeleton className="h-full w-full rounded-xl" />}
          (
          <Image
            src={proxyImageUrl}
            alt="link image"
            fill
            className="rounded-lg object-cover"
            onLoadingComplete={() => setIsLoading(false)}
          />
          )
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-2 pb-4 text-base",
          metadata.image ? "pt-4" : "pt-0",
        )}
      >
        <p className="font-serif text-xl font-bold">{metadata.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {metadata.description}
        </p>
        <p className="font-semibold text-muted-foreground">
          {urlWithoutProtocol}
        </p>
      </div>
    </div>
  );
};

export default LinkPreview;
