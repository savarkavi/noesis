"use client";

import useFollowersInfo from "@/hooks/useFollowersInfo";
import { UserFollowersInfo } from "@/lib/types";

interface FollowersCountProps {
  userId: string;
  initialState: UserFollowersInfo;
}

const FollowersCount = ({ userId, initialState }: FollowersCountProps) => {
  const { data } = useFollowersInfo(userId, initialState);

  return <p>{`Followers: ${data?.totalFollowers}`}</p>;
};

export default FollowersCount;
