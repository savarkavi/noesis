import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { UserFollowersInfo } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = await params;
  try {
    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const data: UserFollowersInfo = {
      totalFollowers: user._count.followers,
      isFollowed: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = await params;
  try {
    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.id === userId) {
      return Response.json(
        { error: "You cannot follow yourself." },
        { status: 400 },
      );
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: userId,
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
  { params }: { params: { userId: string } },
) {
  const { userId } = await params;

  try {
    const { user: loggedInUser } = await getCurrentSession();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedInUser.id === userId) {
      return Response.json(
        { error: "You cannot unfollow yourself." },
        { status: 400 },
      );
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
