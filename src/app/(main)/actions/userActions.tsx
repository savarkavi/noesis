"use server";

import prisma from "@/lib/prisma";
import { userSelect } from "@/lib/types";
import { User } from "@prisma/client";

export const getWhoToFollowUsers = async (currentUser: User) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
      select: userSelect,
      take: 5,
    });

    return { users };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};
