import { PostData } from "@/lib/types";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Image from "next/image";
import { formatRelativeDate } from "@/lib/utils";
import PostOptionsButton from "./PostOptionsButton";
import Link from "next/link";
import Linkify from "../Linkify";
import PostMedia from "./PostMedia";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";

interface PostProps {
  post: PostData;
  userId: string;
}

const Post = ({ post, userId }: PostProps) => {
  const isLiked = post.likes.find((like) => like.userId === userId);
  const isBookmarked = post.bookmarks.find(
    (bookmark) => bookmark.userId === userId,
  );

  return (
    <div className="flex flex-col gap-6 border-b border-gray-700 p-6">
      <div className="flex gap-2">
        <div className="relative h-14 w-14 shrink-0 rounded-full">
          <Image
            src={post.user.avatarUrl || profilePlaceholder}
            alt="profile picture"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <Link
              href={`/users/${post.user.username}`}
              className="font-semibold"
            >
              {post.user.fullname || post.user.username}
            </Link>
            <h2 className="text-sm font-semibold text-gray-500">{`@${post.user.username}`}</h2>
          </div>
          <div className="flex items-start gap-4">
            <p className="text-sm text-gray-500">
              {formatRelativeDate(post.createdAt)}
            </p>
            {userId === post.userId && <PostOptionsButton post={post} />}
          </div>
        </div>
      </div>
      <div>
        <Linkify>
          <p>{post.caption}</p>
        </Linkify>
        {post.attachments.length > 0 && <PostMedia post={post} />}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <LikeButton
            postId={post.id}
            initialState={{ totalLikes: post.likes.length, isLiked: !!isLiked }}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{ isBookmarked: !!isBookmarked }}
        />
      </div>
    </div>
  );
};

export default Post;
