import UserProfile from "@/components/user-page/UserProfile";
import prisma from "@/lib/prisma";
import { userSelect } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

interface UserPageProps {
  params: { username: string };
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
    title: `${(await user).username}`,
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  const user = await getUser(username);

  return (
    <div className="min-h-screen">
      <UserProfile userData={user} />
    </div>
  );
};

export default UserPage;
