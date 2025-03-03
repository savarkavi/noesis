"use client";

import { kyInstance } from "@/lib/ky";
import { PostData, PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Post from "./Post";

interface BookmarksFolderPostsProps {
  folderName: string;
  userId: string;
}

const BookmarksFolderPosts = ({
  folderName,
  userId,
}: BookmarksFolderPostsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["post", "bookmarks", folderName],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`bookmark-folders/${folderName}`, {
          ...(pageParam ? { searchParams: { cursor: pageParam } } : {}),
          timeout: 60000,
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
    return <Loader2 className="mx-auto mt-16 animate-spin text-blue-500" />;
  }

  if (status === "success" && !posts.length) {
    return (
      <p className="mt-16 text-center text-gray-300">
        You don&apos;t have any bookmarks in this folder.
      </p>
    );
  }

  if (isError) {
    console.log(error);

    return (
      <p className="mt-16 text-center text-white">
        An error occured while loading bookmarks
      </p>
    );
  }

  return (
    <div className="mt-6">
      {posts.map((post: PostData) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-6 animate-spin text-blue-500" />
      )}
    </div>
  );
};

export default BookmarksFolderPosts;
