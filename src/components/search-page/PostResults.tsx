import React from "react";
import { PostData, UserData } from "@/lib/types";
import Post from "../post/Post";

interface PostResultsProps {
  data: PostData[];
  user: UserData;
}

const PostResults = ({ data, user }: PostResultsProps) => {
  return (
    <div className="flex flex-col gap-6">
      {!!data.length && (
        <div className="px-4">
          <h2 className="text-3xl font-semibold">Posts</h2>
        </div>
      )}

      {data.map((post: PostData) => (
        <Post
          key={post.id}
          post={post}
          userId={user.id}
          isSinglePost={data.length === 1}
        />
      ))}
    </div>
  );
};

export default PostResults;
