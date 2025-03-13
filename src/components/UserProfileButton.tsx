"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import profilePlaceholder from "../assets/profile-placeholder.png";
import { useState } from "react";
import { useSession } from "@/contexts/SessionProvider";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

const UserProfileButton = () => {
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(true);

  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div>
          {isProfilePictureLoading && (
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          )}
          <div className="relative h-10 w-10 shrink-0 rounded-full">
            <Image
              src={user.avatarUrl || profilePlaceholder}
              alt="profile picture"
              fill
              className="rounded-full object-cover"
              onLoadingComplete={() => setIsProfilePictureLoading(false)}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.username}/edit-profile`}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="w-full" onClick={() => logout()}>
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
