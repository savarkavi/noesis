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

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("Post not found");

  const newComment = await prisma.comment.create({
    data: {
      content: validatedContent,
      postId,
      userId: user.id,
    },
    include: commentDataInclude,
  });

  await prisma.notification.create({
    data: {
      recipientId: post.userId,
      issuerId: user.id,
      postId,
      commentId: newComment.id,
      type: "COMMENT",
    },
  });

  return newComment;
};

export const deleteComment = async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: commentDataInclude,
  });

  await prisma.notification.delete({
    where: {
      commentId: deletedComment.id,
    },
  });

  return deletedComment;
};
