"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";

const PostImageDialog = ({ src }: { src: string }) => {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="relative h-[500px] w-full">
          <Image
            src={src}
            alt="image preview"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="h-full max-w-fit border-none bg-transparent p-0">
        <DialogTitle className="hidden">Full Size Image</DialogTitle>
        <Image
          src={src}
          alt="image preview"
          className="h-screen w-max object-contain"
          width={0}
          height={0}
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostImageDialog;
