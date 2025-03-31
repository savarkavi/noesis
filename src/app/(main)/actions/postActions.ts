"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postDataInclude } from "@/lib/types";
import {
  fetchLinkMetaData,
  fetchYoutubeMetaData,
  getDomain,
} from "@/lib/utils";
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
  sourceUrl: string;
  sourceDomain: string;
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
  sourceUrl: string;
}) => {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  const { caption, attachments, sourceTitle, sourceUrl } =
    postSchema.parse(data);

  const sourceDomain = await getDomain(sourceUrl);

  if (!sourceDomain) throw new Error("Invalid Source URL");

  const postData: CreatePostData = {
    caption: caption || null,
    userId: user.id,
    attachments: {
      connect: attachments.map((id) => ({ id })),
    },
    type: data.type,
    sourceTitle,
    sourceUrl,
    sourceDomain,
  };

  if (data.type === "YOUTUBE_VIDEO") {
    const youtubeMetadata = await fetchYoutubeMetaData(data.sourceUrl);
    postData.youtubeVideoId = youtubeMetadata.id;
    postData.youtubeVideoTitle = youtubeMetadata.title;
    postData.youtubeVideoDescription = youtubeMetadata.description;
    postData.youtubeVideoThumbnail = youtubeMetadata.thumbnail;
  }

  let newPost = await prisma.post.create({
    data: postData,
    include: postDataInclude,
  });

  if (newPost.type === "ARTICLE" || newPost.type === "EXTERNAL_LINK") {
    const linkMetadata = await fetchLinkMetaData(newPost.sourceUrl);

    if (linkMetadata.title && linkMetadata.description && linkMetadata.url) {
      const createdLinkMetadata = await prisma.linkMetadata.create({
        data: linkMetadata,
      });
      newPost = await prisma.post.update({
        where: { id: newPost.id },
        data: { linkMetadataId: createdLinkMetadata.id },
        include: postDataInclude,
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

export const getPopularSources = async () => {
  try {
    const popularSources = await prisma.post.groupBy({
      by: "sourceDomain",
      _count: {
        sourceDomain: true,
      },
      orderBy: {
        _count: {
          sourceDomain: "desc",
        },
      },
      take: 5,
    });

    return popularSources;
  } catch (error) {
    console.log(error);
  }
};
