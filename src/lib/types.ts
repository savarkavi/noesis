import { Prisma } from "@prisma/client";

export const postWithUser = {
  user: {
    select: {
      username: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{ include: typeof postWithUser }>;