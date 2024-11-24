import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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
      const avatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN}`,
      );

      await prisma.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl,
        },
      });

      return { avatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
