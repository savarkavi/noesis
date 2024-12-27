import { Prisma } from "@prisma/client";

export const postDataInclude = {
  user: {
    select: {
      username: true,
      fullname: true,
      avatarUrl: true,
    },
  },
  attachments: true,
  likes: true,
  bookmarks: true,
  _count: {
    select: {
      comments: true,
    },
  },
} satisfies Prisma.PostInclude;

export const userSelect = {
  id: true,
  username: true,
  fullname: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
  followers: true,
  _count: {
    select: {
      posts: true,
    },
  },
} satisfies Prisma.UserSelect;

export const commentDataInclude = {
  user: {
    select: userSelect,
  },
};

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;

export type UserData = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export type CommentData = Prisma.CommentGetPayload<{
  include: typeof commentDataInclude;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface CommentPage {
  comments: CommentData[];
  nextCursor: string | null;
}

export interface UserFollowersInfo {
  totalFollowers: number;
  isFollowed: boolean;
}

export interface PostLikesInfo {
  totalLikes: number;
  isLiked: boolean;
}

export interface PostBookmarkInfo {
  isBookmarked: boolean;
}
