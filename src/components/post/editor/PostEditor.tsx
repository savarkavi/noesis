"use client";

import PostTypeDropdown from "./PostTypeDropdown";
import { useState } from "react";
import PostCommentry from "./PostCommentry";
import Image from "next/image";
import profilePlaceholder from "../../../assets/profile-placeholder.png";
import { useSession } from "@/contexts/SessionProvider";

const PostEditor = () => {
  const { user } = useSession();
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-12 border-b border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="relative h-14 w-14 rounded-full">
          <Image
            src={user.avatarUrl ? user.avatarUrl : profilePlaceholder}
            alt="profile picture"
            fill
            className="object-cover"
          />
        </div>
        <PostTypeDropdown value={value} setValue={setValue} />
      </div>
      <PostCommentry value={value} />
    </div>
  );
};

export default PostEditor;
