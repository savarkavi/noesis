"use server";

import { fetchMetaData } from "@/lib/mutations/postMutations";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postDataInclude } from "@/lib/types";
import { postSchema } from "@/lib/validation";
import { PostType } from "@prisma/client";

export const createPost = async (data: {
  caption: string | null;
  attachments: string[];
  type: PostType;
  sourceTitle: string | null;
  source: string;
}) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const { caption, attachments, sourceTitle, source } = postSchema.parse(data);

  const newPost = await prisma.post.create({
    data: {
      caption: caption || null,
      userId: user.id,
      attachments: {
        connect: attachments.map((id) => ({ id })),
      },
      type: data.type,
      sourceTitle,
      source,
    },
    include: postDataInclude,
  });

  if (newPost.type === "ARTICLE" || newPost.type === "EXTERNAL_LINK") {
    const linkMetadata = await fetchMetaData(newPost.source);

    if (linkMetadata.title && linkMetadata.description && linkMetadata.url) {
      const createdLinkMetadata = await prisma.linkMetadata.create({
        data: linkMetadata,
      });
      await prisma.post.update({
        where: { id: newPost.id },
        data: { linkMetadataId: createdLinkMetadata.id },
      });
    }
  }

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
    include: postDataInclude,
  });

  return deletedPost;
};
