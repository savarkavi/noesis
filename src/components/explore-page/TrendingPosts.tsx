"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostData, PostPage } from "@/lib/types";
import { kyInstance } from "@/lib/ky";
import { useInView } from "react-intersection-observer";
import Post from "../post/Post";

interface TrendingPostsProps {
  userId: string;
  selectValue: string;
}

const TrendingPosts = ({ userId, selectValue }: TrendingPostsProps) => {
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
    queryKey: ["post", "trending", selectValue],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("posts/trending", {
          searchParams: {
            timeRange: selectValue,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
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

  if (status === "success" && !posts.length) {
    return <p className="mt-16 text-center text-gray-300">No posts found</p>;
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">
        Something went wrong. Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {posts.map((post: PostData) => (
        <Post
          key={post.id}
          post={post}
          userId={userId}
          isSinglePost={posts.length === 1}
        />
      ))}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default TrendingPosts;
