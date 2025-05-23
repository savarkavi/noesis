"use client";

import { kyInstance } from "@/lib/ky";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotificationButton = ({ isMenuSheet }: { isMenuSheet?: boolean }) => {
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () =>
      kyInstance
        .get("notifications/unread-count")
        .json<{ unreadCount: number }>(),
    refetchInterval: 60 * 1000,
  });

  return (
    <Link
      href={"/notifications"}
      className={cn(
        "flex items-center gap-4 rounded-full px-4 py-2 text-white hover:bg-muted",
        pathname.includes("/notifications") && "bg-muted",
      )}
    >
      <div className="relative">
        <BellIcon size={28} className="text-blue-600" />
        {data?.unreadCount !== undefined && data?.unreadCount > 0 && (
          <div className="absolute -right-2 -top-4 flex h-6 w-6 items-center justify-center rounded-full border bg-blue-600 p-2 text-sm font-semibold">
            {data?.unreadCount}
          </div>
        )}
      </div>
      <span
        className={cn(isMenuSheet ? "text-xl" : "hidden text-xl md:inline")}
      >
        Notifications
      </span>
    </Link>
  );
};

export default NotificationButton;
