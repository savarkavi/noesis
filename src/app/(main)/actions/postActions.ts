"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postWithUser } from "@/lib/types";
import { postSchema } from "@/lib/validation";

export const createPost = async (data: string) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const { caption } = postSchema.parse({ caption: data });

  const newPost = await prisma.post.create({
    data: {
      caption,
      userId: user.id,
    },
    include: postWithUser,
  });

  return newPost;
};

export const deletePost = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: postWithUser,
  });

  return deletedPost;
};
