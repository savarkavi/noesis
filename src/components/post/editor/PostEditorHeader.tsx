import Image from "next/image";
import React from "react";
import PostTypeDropdown from "./PostTypeDropdown";
import { useSession } from "@/contexts/SessionProvider";
import profilePlaceholder from "../../../assets/profile-placeholder.png";
import { PostType } from "@prisma/client";

interface PostEditorHeaderProps {
  value: PostType | null;
  onValueChange: (type: PostType | null) => void;
}

const PostEditorHeader = ({ value, onValueChange }: PostEditorHeaderProps) => {
  const { user } = useSession();

  return (
    <div className="flex items-center justify-between">
      <div className="relative h-14 w-14 rounded-full">
        <Image
          src={user.avatarUrl ? user.avatarUrl : profilePlaceholder}
          alt="profile picture"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <PostTypeDropdown value={value} onValueChange={onValueChange} />
    </div>
  );
};

export default PostEditorHeader;
