import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { error: "Invalid authorization header" },
        { status: 401 },
      );
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
    });

    new UTApi().deleteFiles(unusedMedia.map((f) => f.url.split("/f/")[1]));

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((f) => f.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
