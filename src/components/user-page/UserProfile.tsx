import { UserData } from "@/lib/types";
import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import { formatDate } from "date-fns";
import FollowersCount from "./FollowersCount";
import { getCurrentSession } from "@/lib/session";
import FollowButton from "../FollowButton";
import Linkify from "../Linkify";
import Link from "next/link";

const UserProfile = async ({ userData }: { userData: UserData }) => {
  const { user } = await getCurrentSession();

  if (!user) return;

  const isFollowedByLoggedInUser = userData.followers.find(
    (follower) => follower.followerId === user.id,
  );

  const userFollowersInfo = {
    totalFollowers: userData.followers.length,
    isFollowed: !!isFollowedByLoggedInUser,
  };

  return (
    <div className="p-6">
      <div className="relative mx-auto h-[150px] w-[150px] rounded-full">
        <Image
          src={userData.avatarUrl || profilePlaceholder}
          alt="profile image"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div>
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold capitalize">
              {userData.fullname || userData.username}
            </h2>
            {userData.username !== user.username ? (
              <FollowButton
                userId={userData.id}
                initialState={userFollowersInfo}
              />
            ) : (
              <Link
                href={`/users/${userData.username}/edit-profile`}
                className="flex items-center justify-center rounded-2xl bg-blue-500 px-4 py-2 text-sm text-white"
              >
                Edit profile
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="">{`@${userData.username}`}</span>
            <p>{`Joined ${formatDate(userData.createdAt, "MMM d, yyyy")}`}</p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {userData.bio && (
            <Linkify>
              <p>{userData.bio}</p>
            </Linkify>
          )}
          <div className="flex items-center gap-6">
            <p>{`Posts: ${userData._count.posts}`}</p>
            <FollowersCount
              userId={userData.id}
              initialState={userFollowersInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
