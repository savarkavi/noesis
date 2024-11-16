"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeletePostDialog from "./DeletePostDialog";
import { useState } from "react";
import { PostData } from "@/lib/types";

const PostOptionsButton = ({ post }: { post: PostData }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        open={open}
        onClose={() => setOpen(false)}
        post={post}
      />
    </>
  );
};

export default PostOptionsButton;
