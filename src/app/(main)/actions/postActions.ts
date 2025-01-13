"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postDataInclude } from "@/lib/types";
import { fetchLinkMetaData, fetchYoutubeMetaData } from "@/lib/utils";
import { postSchema } from "@/lib/validation";
import { PostType } from "@prisma/client";

type CreatePostData = {
  caption: string | null;
  userId: string;
  attachments: {
    connect: {
      id: string;
    }[];
  };
  type: PostType;
  sourceTitle: string | null;
  source: string;
  youtubeVideoId?: string | null;
  youtubeVideoTitle?: string;
  youtubeVideoDescription?: string;
  youtubeVideoThumbnail?: string;
};

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

  const postData: CreatePostData = {
    caption: caption || null,
    userId: user.id,
    attachments: {
      connect: attachments.map((id) => ({ id })),
    },
    type: data.type,
    sourceTitle,
    source,
  };

  if (data.type === "YOUTUBE_VIDEO") {
    const youtubeMetadata = await fetchYoutubeMetaData(data.source);
    postData.youtubeVideoId = youtubeMetadata.id;
    postData.youtubeVideoTitle = youtubeMetadata.title;
    postData.youtubeVideoDescription = youtubeMetadata.description;
    postData.youtubeVideoThumbnail = youtubeMetadata.thumbnail;
  }

  const newPost = await prisma.post.create({
    data: postData,
    include: postDataInclude,
  });

  if (newPost.type === "ARTICLE" || newPost.type === "EXTERNAL_LINK") {
    const linkMetadata = await fetchLinkMetaData(newPost.source);

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
