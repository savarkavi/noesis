import { Prisma } from "@prisma/client";

export const postWithUser = {
  user: {
    select: {
      username: true,
      fullname: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export const userSelect = {
  id: true,
  username: true,
  fullname: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export type PostData = Prisma.PostGetPayload<{ include: typeof postWithUser }>;
export type UserData = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface UserFollowersInfo {
  totalFollowers: number;
  isFollowed: boolean;
}
