"use client";

import { kyInstance } from "@/lib/ky";
import { UserPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Link from "next/link";
import { Button } from "../ui/button";

interface SearchResultsProps {
  searchQuery: string;
}

const UsersList = ({ searchQuery }: SearchResultsProps) => {
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
    queryKey: ["userSearchResults", searchQuery],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("search/user", {
          searchParams: {
            q: searchQuery,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
          timeout: 15000,
        })
        .json<UserPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const users = data?.pages.flatMap((page) => page.users) || [];

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

  if (status === "success" && !users.length) {
    return (
      <p className="mt-16 text-center text-gray-300">
        {`No user found with the query "${searchQuery}"`}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">An unexpected error occured</p>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-12">
      {users.map((user) => (
        <div key={user.id} className="flex justify-between">
          <div className="flex gap-10">
            <div className="relative h-[80px] w-[80px] rounded-full">
              <Image
                src={user.avatarUrl || profilePlaceholder}
                alt="profile image"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">
                {user.fullname || user.username}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <h2>{`@${user.username}`}</h2>
                <span>•</span>
                <p>{`${user.followers.length} followers`}</p>
              </div>
            </div>
          </div>
          <Link href={`/users/${user.username}`} className="h-fit rounded-full">
            <Button className="w-20 rounded-full text-white">View</Button>
          </Link>
        </div>
      ))}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default UsersList;
