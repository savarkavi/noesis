import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  userAvatar: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { user } = await getCurrentSession();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split("/f/")[1];

        await new UTApi().deleteFiles(key);
      }

      await prisma.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl: file.url,
        },
      });

      return { avatarUrl: file.url };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { user } = await getCurrentSession();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
