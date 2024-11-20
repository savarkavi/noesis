import { getWhoToFollowUsers } from "@/app/(main)/actions/userActions";
import { getCurrentSession } from "@/lib/session";
import Image from "next/image";
import profilePlaceholder from "../../assets/profile-placeholder.png";
import FollowButton from "../FollowButton";

const WhoToFollow = async () => {
  const { user } = await getCurrentSession();

  if (!user) return null;

  const { users } = await getWhoToFollowUsers(user);

  return (
    <div className="w-full rounded-xl border border-gray-700 p-4">
      <h2 className="text-2xl font-semibold capitalize">Who to follow</h2>
      {users?.map((data) => {
        const isFollowedByLoggedInUser = data.followers.find(
          (follower) => follower.followerId === user.id,
        );

        const userFollowersInfo = {
          totalFollowers: data.followers.length,
          isFollowed: !!isFollowedByLoggedInUser,
        };

        return (
          <div key={data.id} className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="relative h-14 w-14 rounded-full">
                <Image
                  src={data.avatarUrl || profilePlaceholder}
                  alt="profile picture"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold">
                  {data.fullname || data.username}
                </h2>
                <h2 className="text-sm font-semibold text-gray-500">{`@${data.username}`}</h2>
              </div>
            </div>
            <FollowButton userId={data.id} initialState={userFollowersInfo} />
          </div>
        );
      })}
    </div>
  );
};

export default WhoToFollow;
