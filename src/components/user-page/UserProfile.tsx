import { UserData } from "@/lib/types";
import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import { formatDate } from "date-fns";
import FollowersCount from "./FollowersCount";
import { getCurrentSession } from "@/lib/session";
import FollowButton from "../FollowButton";

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
      <div className="relative mx-auto h-[200px] w-[200px] rounded-full">
        <Image
          src={userData.avatarUrl || profilePlaceholder}
          alt="profile image"
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <div className="flex justify-between">
            <h2 className="text-3xl font-semibold capitalize">
              {userData.fullname || userData.username}
            </h2>
            <FollowButton
              userId={userData.id}
              initialState={userFollowersInfo}
            />
          </div>
          <span className="text-gray-500">{`@${userData.username}`}</span>
        </div>
        <p>{`Joined on ${formatDate(userData.createdAt, "MMM d, yyyy")}`}</p>
        <div className="flex items-center gap-6">
          <p>{`Posts: ${userData._count.posts}`}</p>
          <FollowersCount
            userId={userData.id}
            initialState={userFollowersInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
