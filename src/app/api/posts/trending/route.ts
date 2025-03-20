import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const timeRange = req.nextUrl.searchParams.get("timeRange") || "today";

    const pageSize = 10;

    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let dateThreshold = new Date();

    switch (timeRange) {
      case "today":
        break;
      case "week":
        dateThreshold.setDate(dateThreshold.getDate() - 7);
        break;
      case "month":
        dateThreshold.setMonth(dateThreshold.getMonth() - 1);
        break;
      case "year":
        dateThreshold.setFullYear(dateThreshold.getFullYear() - 1);
        break;
      case "all-time":
        dateThreshold = new Date(0);
        break;
      default:
        break;
    }

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: dateThreshold,
        },
      },
      include: postDataInclude,
      orderBy: { likes: { _count: "desc" } },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
