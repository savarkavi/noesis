import UserPosts from "@/components/user-page/UserPosts";
import UserProfile from "@/components/user-page/UserProfile";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { userSelect } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: userSelect,
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({ params }: UserPageProps) {
  const { username } = await params;
  const user = await getUser(username);

  return {
    title: `${user.username}`,
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  const user = await getUser(username);

  const { user: loggedInUser } = await getCurrentSession();

  if (!loggedInUser) return;

  return (
    <div className="min-h-screen">
      <UserProfile userData={user} />
      <UserPosts userId={user.id} loggedInUser={loggedInUser.id} />
    </div>
  );
};

export default UserPage;
