import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { PostPage, postDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ folderName: string }> },
) {
  const { folderName } = await params;

  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folder = await prisma.bookmarkfolder.findFirst({
      where: {
        userId: loggedInUser.id,
        name: folderName,
      },
    });

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 });
    }

    const bookmarkConnections = await prisma.bookmarkToBookmarkfolder.findMany({
      where: {
        bookmarkfolderId: folder.id,
      },
      include: {
        bookmark: {
          include: {
            post: {
              include: postDataInclude,
            },
          },
        },
      },
      orderBy: { bookmark: { createdAt: "desc" } },
      take: pageSize + 1,
      cursor: cursor
        ? {
            bookmarkId_bookmarkfolderId: {
              bookmarkId: cursor,
              bookmarkfolderId: folder.id,
            },
          }
        : undefined,
    });

    const nextCursor =
      bookmarkConnections.length > pageSize
        ? bookmarkConnections[pageSize].bookmarkId
        : null;

    const data: PostPage = {
      posts: bookmarkConnections
        .slice(0, pageSize)
        .map((connection) => connection.bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
