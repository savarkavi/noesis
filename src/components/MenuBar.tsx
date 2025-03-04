"use client";

import { menuItems } from "@/constants";
import Link from "next/link";
import NotificationButton from "./NotificationButton";
import { cn } from "@/lib/utils";
import { useSession } from "@/contexts/SessionProvider";
import { usePathname } from "next/navigation";

const MenuBar = () => {
  const { user } = useSession();
  const pathname = usePathname();

  return (
    <div className="sticky top-12 hidden h-fit justify-center px-8 sm:flex md:w-full md:max-w-[280px]">
      <div className="mt-24 flex flex-col gap-10">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return item.name === "Notifications" ? (
            <NotificationButton key={item.name} />
          ) : (
            <Link
              href={
                item.path === "/users" ? `/users/${user?.username}` : item.path
              }
              key={item.name}
              className={cn(
                "flex items-center gap-4 rounded-full px-3 py-2 text-white hover:bg-muted",
                pathname.includes(item.path) && "bg-muted",
              )}
            >
              <Icon size={28} className="text-blue-600" />
              <span className="hidden text-xl md:inline">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;
