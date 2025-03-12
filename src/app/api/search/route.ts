import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postDataInclude, SearchPage, UserData, userSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || "";

    if (!q.trim()) {
      return Response.json({
        users: [],
        posts: [],
        nextCursor: null,
      });
    }

    const searchQuery = q.split(" ").join(" | ");

    const pageSize = 10;

    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let users: UserData[] = [];
    if (!cursor) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                search: searchQuery,
              },
            },
            {
              fullname: {
                search: searchQuery,
              },
            },
          ],
        },
        select: userSelect,
        take: 3,
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            caption: {
              search: searchQuery,
            },
          },
          {
            sourceTitle: {
              search: searchQuery,
            },
          },
          {
            linkMetadata: {
              title: {
                search: searchQuery,
              },
            },
          },
          {
            linkMetadata: {
              description: {
                search: searchQuery,
              },
            },
          },
          {
            youtubeVideoTitle: {
              search: searchQuery,
            },
          },
          {
            youtubeVideoDescription: {
              search: searchQuery,
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              fullname: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: SearchPage = {
      users,
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
