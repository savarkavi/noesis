"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { UserData, userSelect } from "@/lib/types";
import { updateUserProfileSchema, UserProfileValues } from "@/lib/validation";

export const getWhoToFollowUsers = async (currentUser: UserData) => {
  console.log(currentUser.id);

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: currentUser.id,
            },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: currentUser.id,
                },
              },
            },
          },
        ],
      },
      select: userSelect,
      take: 3,
    });

    console.log(users);

    return { users };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};

export const updateUserProfile = async (data: UserProfileValues) => {
  const validatedData = updateUserProfileSchema.parse(data);

  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedData,
    select: userSelect,
  });

  return updatedUser;
};
