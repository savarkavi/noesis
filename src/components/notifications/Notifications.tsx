"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { NotificationData, NotificationPage } from "@/lib/types";
import { kyInstance } from "@/lib/ky";
import { useInView } from "react-intersection-observer";
import Notification from "./Notification";
import { useEffect } from "react";

const Notifications = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
    status,
  } = useInfiniteQuery({
    queryKey: ["notification"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("notifications/mark-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification"], {
        unreadCount: 0,
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
  });

  if (isPending) {
    return <Loader2 className="mx-auto mt-8 animate-spin text-blue-500" />;
  }

  if (status === "success" && !notifications.length) {
    return (
      <p className="mt-16 text-center text-gray-300">
        You don&apos;t have any notifications yet.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">
        An error occured while fetching notifications
      </p>
    );
  }

  return (
    <div>
      {notifications.map((notification: NotificationData) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default Notifications;
