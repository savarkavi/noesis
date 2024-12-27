"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { commentDataInclude } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

type CreateCommentParams = {
  content: string;
  postId: string;
};

export const createComment = async ({
  content,
  postId,
}: CreateCommentParams) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const { content: validatedContent } = commentSchema.parse({ content });

  const newComment = await prisma.comment.create({
    data: {
      content: validatedContent,
      postId,
      userId: user.id,
    },
    include: commentDataInclude,
  });

  return newComment;
};
