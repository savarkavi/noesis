"use client";

import { kyInstance } from "@/lib/ky";
import { SearchPage, UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import UserResults from "./UserResults";
import PostResults from "./PostResults";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  searchQuery: string;
  user: UserData;
}

const SearchResults = ({ searchQuery, user }: SearchResultsProps) => {
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
    queryKey: ["searchResults", searchQuery],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("search", {
          searchParams: {
            q: searchQuery,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
          timeout: 15000,
        })
        .json<SearchPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const users = data?.pages.flatMap((page) => page.users) || [];
  const posts = data?.pages.flatMap((page) => page.posts) || [];

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

  if (status === "success" && !posts.length && !users.length) {
    return (
      <p className="mt-16 text-center text-gray-300">
        {`No results found with the query "${searchQuery}"`}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">An unexpected error occured</p>
    );
  }

  return (
    <div className="mt-4">
      <UserResults data={users} query={searchQuery} />
      <div className={cn(!!users.length && "mt-24")}>
        <PostResults data={posts} user={user} />
      </div>
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default SearchResults;
