"use client";

import Post from "./Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostData, PostPage } from "@/lib/types";
import { kyInstance } from "@/lib/ky";
import { useInView } from "react-intersection-observer";

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["post", "feed"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "posts/feed",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

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

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">
        Something went wrong. Please try again later.
      </p>
    );
  }

  return (
    <div>
      {posts.map((post: PostData) => (
        <Post key={post.id} post={post} />
      ))}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default Feed;
