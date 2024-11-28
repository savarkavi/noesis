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

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
export type UserData = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface UserFollowersInfo {
  totalFollowers: number;
  isFollowed: boolean;
}
