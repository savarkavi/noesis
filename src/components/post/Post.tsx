"use client";

import { PostData } from "@/lib/types";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import Image from "next/image";
import { formatRelativeDate } from "@/lib/utils";
import PostOptionsButton from "./PostOptionsButton";
import Link from "next/link";
import Linkify from "../Linkify";
import PostMedia from "./PostMedia";
import LikeButton from "../LikeButton";
import BookmarkButton from "../bookmark-feature/BookmarkButton";
import CommentButton from "../CommentButton";
import { useState } from "react";
import Comments from "./Comments";
import { ExternalLink } from "lucide-react";
import LinkPreview from "./LinkPreview";
import YoutubeVideoPreview from "./YoutubeVideoPreview";

interface PostProps {
  post: PostData;
  userId: string;
}

const Post = ({ post, userId }: PostProps) => {
  const [isCommentsClicked, setIsCommentsClicked] = useState(false);

  const isLiked = post.likes.find((like) => like.userId === userId);
  const isBookmarked = post.bookmarks.find(
    (bookmark) => bookmark.userId === userId,
  );

  const handleCommentsToggle = () => setIsCommentsClicked((prev) => !prev);
  const handleCommentsClose = () => setIsCommentsClicked(false);

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
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={`/users/${post.user.username}`}
                className="text-sm font-semibold md:text-base"
              >
                {post.user.fullname || post.user.username}
              </Link>
              <p className="text-sm text-gray-500">
                {formatRelativeDate(post.createdAt)}
              </p>
            </div>
            <h2 className="text-sm font-semibold text-gray-500">{`@${post.user.username}`}</h2>
          </div>
          <div className="flex items-start gap-4">
            <button className="hidden w-fit items-center gap-2 rounded-full border border-muted-foreground bg-muted px-4 py-1 text-[0.8rem] lg:flex">
              {post.type.toLowerCase().replace(/_/g, " ")}
            </button>
            {userId === post.userId && <PostOptionsButton post={post} />}
          </div>
        </div>
      </div>
      <div>
        <Linkify>
          <p>{post.caption}</p>
        </Linkify>
        <div className="mt-4 flex w-full flex-col">
          {post.type !== "MEDIA" ? (
            <Link
              target="_blank"
              href={post.source}
              className="w-full text-blue-600"
            >
              {post.type === "YOUTUBE_VIDEO" ? (
                <YoutubeVideoPreview post={post} />
              ) : post.linkMetadata ? (
                <LinkPreview metadata={post.linkMetadata} />
              ) : (
                <span className="w-fit text-3xl">{post.sourceTitle}</span>
              )}
            </Link>
          ) : (
            <Link
              target="_blank"
              href={post.source}
              className="flex w-fit items-center gap-1 self-end text-muted-foreground"
            >
              <span>source</span>
              <ExternalLink className="size-4" />
            </Link>
          )}
        </div>
        {post.attachments.length > 0 && <PostMedia post={post} />}
      </div>
      <div className="mt-2 flex items-center gap-6 md:justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <LikeButton
            postId={post.id}
            initialState={{ totalLikes: post.likes.length, isLiked: !!isLiked }}
          />
          <CommentButton
            totalComments={post._count.comments}
            onClicked={handleCommentsToggle}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{ isBookmarked: !!isBookmarked }}
        />
        <div className="flex w-full justify-end lg:hidden">
          <button className="w-fit items-center gap-2 self-end rounded-full border border-muted-foreground bg-muted px-4 py-1 text-[0.8rem] lg:hidden">
            {post.type.toLowerCase().replace(/_/g, " ")}
          </button>
        </div>
      </div>
      {isCommentsClicked && (
        <Comments postId={post.id} onClicked={handleCommentsClose} />
      )}
    </div>
  );
};

export default Post;
