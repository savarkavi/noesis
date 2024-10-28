"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postSchema } from "@/lib/validation";

export const createPost = async (data: string) => {
  try {
    const { user } = await getCurrentSession();

    if (!user) throw new Error("Unauthorized");

    const { caption } = postSchema.parse({ caption: data });

    await prisma.post.create({
      data: {
        caption,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { posts };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};
