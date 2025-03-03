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

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: loggedInUser.id,
        folders: {
          some: {
            bookmarkfolderId: folder.id,
          },
        },
      },
      include: {
        post: {
          include: postDataInclude,
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: PostPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ folderName: string }> },
) {
  const { bookmarkId } = await req.json();

  try {
    if (!bookmarkId) {
      return Response.json({ error: "Invalid Bookmark Id" }, { status: 401 });
    }

    const { folderName } = await params;
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

    await prisma.bookmarkToBookmarkfolder.upsert({
      where: {
        bookmarkId_bookmarkfolderId: {
          bookmarkId,
          bookmarkfolderId: folder.id,
        },
      },
      create: {
        bookmarkId,
        bookmarkfolderId: folder.id,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ folderName: string }> },
) {
  const { bookmarkId } = await req.json();

  try {
    if (!bookmarkId) {
      return Response.json({ error: "Invalid Bookmark Id" }, { status: 401 });
    }

    const { folderName } = await params;
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

    await prisma.bookmarkToBookmarkfolder.deleteMany({
      where: {
        bookmarkId,
        bookmarkfolderId: folder.id,
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
