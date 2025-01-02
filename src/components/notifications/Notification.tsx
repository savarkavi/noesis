import { NotificationData } from "@/lib/types";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Image from "next/image";
import { JSX } from "react";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Notification = ({ notification }: { notification: NotificationData }) => {
  const notificationTypeStyle: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer?.username} has followed you`,
      icon: <User2 className="size-6 fill-blue-500 text-blue-500" />,
      href: `/users/${notification.issuer?.username}`,
    },
    COMMENT: {
      message: `${notification.issuer?.username} has commented on your post`,
      icon: <MessageCircle className="size-6 fill-blue-500 text-blue-500" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer?.username} has liked your post`,
      icon: <Heart className="size-6 fill-blue-500 text-blue-500" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeStyle[notification.type];

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col gap-6 border-b border-gray-700 p-6",
        !notification.read && "bg-blue-300/5",
      )}
    >
      <div className="flex gap-6">
        {icon}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <div className="relative h-10 w-10 shrink-0 rounded-full">
              <Image
                src={notification.issuer?.avatarUrl || profilePlaceholder}
                alt="profile picture"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="gap- flex flex-col text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <h2 className="font-semibold">
                  {notification.issuer?.username}
                </h2>
                <h2 className="text-muted-foreground">{`@${notification.issuer?.username}`}</h2>
              </div>
              <p>{message}</p>
            </div>
          </div>
          {notification.type === "LIKE" ? (
            <p className="line-clamp-3 whitespace-pre-line text-gray-400">
              {notification.post?.caption}
            </p>
          ) : (
            notification.type === "COMMENT" && (
              <p className="line-clamp-3 whitespace-pre-line text-gray-400">
                {notification.comment?.content}
              </p>
            )
          )}
        </div>
      </div>
    </Link>
  );
};

export default Notification;
