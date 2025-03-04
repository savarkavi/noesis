"use client";

import { kyInstance } from "@/lib/ky";
import { PostData, PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Post from "../post/Post";

const UserPosts = ({
  userId,
  loggedInUser,
}: {
  userId: string;
  loggedInUser: string;
}) => {
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
    queryKey: ["post", "user-post", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `users/${userId}/posts`,
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

  if (status === "success" && !posts.length) {
    return (
      <p className="mt-16 text-center text-gray-300">
        {userId === loggedInUser
          ? "You haven't posted anything yet."
          : " This user hasn&apos;t posted anything yet."}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-white">
        Something went wrong. Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-8">
      {posts.map((post: PostData) => (
        <Post
          key={post.id}
          post={post}
          userId={loggedInUser}
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

export default UserPosts;
