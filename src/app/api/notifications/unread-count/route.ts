import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user?.id,
        read: false,
      },
    });

    return Response.json({ unreadCount });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
