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
import { useSession } from "@/contexts/SessionProvider";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

const UserProfileButton = () => {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div>
          <div className="relative h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12">
            <Image
              src={user.avatarUrl || profilePlaceholder}
              alt="profile picture"
              fill
              className="rounded-full object-cover"
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
