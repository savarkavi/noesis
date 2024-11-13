import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { postWithUser } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: postWithUser,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
