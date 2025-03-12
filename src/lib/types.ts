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
  linkMetadata: true,
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
  bookmarkfolders: true,
} satisfies Prisma.UserSelect;

export const commentDataInclude = {
  user: {
    select: {
      username: true,
      fullname: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.CommentInclude;

export const notificationDataInclude = {
  issuer: {
    select: {
      fullname: true,
      username: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      caption: true,
    },
  },
  comment: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export const bookmarkFolderDataInclude = {
  bookmarks: {
    select: {
      bookmarkId: true,
    },
  },
} satisfies Prisma.BookmarkfolderInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;

export type UserData = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export type CommentData = Prisma.CommentGetPayload<{
  include: typeof commentDataInclude;
}>;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationDataInclude;
}>;

export type BookmarkFolderData = Prisma.BookmarkfolderGetPayload<{
  include: typeof bookmarkFolderDataInclude;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface CommentPage {
  comments: CommentData[];
  nextCursor: string | null;
}

export interface NotificationPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface SearchPage {
  users: UserData[];
  posts: PostData[];
  nextCursor: string | null;
}

export interface UserPage {
  users: UserData[];
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
  id: string | null;
  isBookmarked: boolean;
}

export interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface YoutubeMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  totalBookmarks: number;
}
