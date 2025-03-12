import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { UserPage, userSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || "";

    const searchQuery = q.split(" ").join(" | ");

    const pageSize = 10;

    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
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
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = users.length > pageSize ? users[pageSize].id : null;

    const data: UserPage = {
      users: users.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
