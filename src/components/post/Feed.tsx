"use client";

import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostData } from "@/lib/types";
import { kyInstance } from "@/lib/ky";

const Feed = () => {
  const query = useQuery({
    queryKey: ["post", "feed"],
    queryFn: kyInstance.get("posts/feed").json<PostData[]>,
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto mt-8 animate-spin text-blue-500" />;
  }

  if (query.status === "error") {
    return (
      <p className="mt-8 text-center text-white">
        Something went wrong. Please try again later.
      </p>
    );
  }

  return (
    <div>
      {query.data?.map((post: PostData) => <Post key={post.id} post={post} />)}
    </div>
  );
};

export default Feed;
