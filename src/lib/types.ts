import { Prisma } from "@prisma/client";

export const postWithUSer = {
  user: {
    select: {
      username: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{ include: typeof postWithUSer }>;
