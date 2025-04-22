"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

const PostImageDialog = ({ src }: { src: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogImageLoading, setIsDialogImageLoading] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full" onClick={handleClick}>
        <div className="relative aspect-auto w-full">
          {isLoading && <Skeleton className="h-auto w-full rounded-xl" />}
          <Image
            src={src}
            alt="image preview"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="rounded-xl object-contain"
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-max border-none bg-transparent p-0 xl:h-full xl:max-w-fit">
        <DialogTitle className="hidden">Full Size Image</DialogTitle>
        {isDialogImageLoading && <Skeleton className="h-screen w-screen" />}
        <Image
          src={src}
          alt="image preview"
          className="h-screen w-full object-contain xl:w-max"
          width={0}
          height={0}
          unoptimized
          onLoadingComplete={() => setIsDialogImageLoading(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostImageDialog;
