import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { BookmarkFolder, bookmarkFolderDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.bookmarkfolder.findMany({
      where: {
        userId: loggedInUser.id,
      },
      include: bookmarkFolderDataInclude,
    });

    return Response.json(folders);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  try {
    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingFolder = await prisma.bookmarkfolder.findFirst({
      where: {
        name,
        userId: loggedInUser.id,
      },
    });

    if (existingFolder) {
      return Response.json(
        {
          error:
            "A folder with the same name already exists. Choose a different name.",
        },
        { status: 409 },
      );
    }

    const newFolder = await prisma.bookmarkfolder.create({
      data: {
        name,
        userId: loggedInUser.id,
      },
      include: {
        bookmarks: true,
      },
    });

    const data: BookmarkFolder = {
      id: newFolder.id,
      name: newFolder.name,
      totalBookmarks: newFolder.bookmarks.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
